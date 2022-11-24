/* eslint-disable no-global-assign */
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Layout from './layout';
import { Authentication } from '@/domain/usecases';
import {
  LoadMusicSpy,
  LoadUserSpy,
  mockAccountModel,
  mockAccountWithSpotifyModel,
  mockMusicModel,
  SpotifyAuthorizeSpy
} from '@/domain/mocks';
import { setTimeout } from 'timers/promises';
import { faker } from '@faker-js/faker';

type SutTypes = {
  history: MemoryHistory;
  setCurrentAccountMock: (account: Authentication.Model) => void;
  spotifyAuthorizeSpy: SpotifyAuthorizeSpy;
  loadUserSpy: LoadUserSpy;
  loadMusicSpy: LoadMusicSpy;
};

const history = createMemoryHistory({ initialEntries: ['/'] });
const makeSut = (account = mockAccountModel(), loadMusicSpy = new LoadMusicSpy()): SutTypes => {
  const loadUserSpy = new LoadUserSpy();
  const spotifyAuthorizeSpy = new SpotifyAuthorizeSpy();
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Layout({ loadUser: loadUserSpy, spotifyAuthorize: spotifyAuthorizeSpy, loadMusic: loadMusicSpy }),
    account
  });
  return { history, setCurrentAccountMock, spotifyAuthorizeSpy, loadUserSpy, loadMusicSpy };
};

describe('Layout Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have home page as active on initial state', () => {
    makeSut();
    const homeNavItem = screen.getByTestId('home');
    const homeNavText = screen.getByTestId('home-text');
    const homeNavFlex = screen.getByTestId('nav-flex');
    expect(homeNavItem).toBeInTheDocument();
    expect(homeNavItem).toHaveAttribute('data-status', 'active');
    expect(homeNavItem).toHaveAttribute('data-size', 'large');
    expect(homeNavText).toHaveTextContent('Home');
    expect(homeNavText).toHaveStyle('display: flex');
    expect(homeNavFlex).toHaveAttribute('data-status', 'large');
  });

  test('should load spotify user into currentAccount state', async () => {
    const account = mockAccountWithSpotifyModel();
    const { loadUserSpy, setCurrentAccountMock } = makeSut(account);
    expect(loadUserSpy.callsCount).toBe(1);
    await setTimeout(1000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith({
      ...account,
      user: {
        ...account.user,
        spotify: { ...account.user.spotify, avatarUrl: loadUserSpy.spotifyUser.images[0].url }
      }
    });
  });

  test('should navigate to commands page', async () => {
    makeSut();
    const commandsNavlink = screen.getByTestId('commands-link');
    await userEvent.click(commandsNavlink);
    expect(history.location.pathname).toBe('/commands');
  });

  test('should have page outlet', () => {
    makeSut();
    const pageOutlet = screen.getByTestId('page-outlet');
    expect(pageOutlet).toBeInTheDocument();
  });

  test('should show toggle sidebar on bot name click', async () => {
    makeSut();
    const botName = screen.getByTestId('bot-name');
    await userEvent.click(botName);
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'small');
  });

  test('should show toggle sidebar on bot logo click', async () => {
    makeSut();
    const botName = screen.getByTestId('bot-logo');
    await userEvent.click(botName);
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'small');
  });

  test('should have user menu', () => {
    const account = mockAccountModel();
    makeSut(account);
    const userMenu = screen.getByTestId('user-menu');
    const iconChevronDown = screen.getByTestId('user-menu-down');
    const userName = screen.getByTestId('user-name');
    expect(userMenu).toBeInTheDocument();
    expect(iconChevronDown).toBeInTheDocument();
    expect(userName).toHaveTextContent(account.user.name.split(' ')[0]);
  });

  test('should show user menu items', async () => {
    makeSut();
    const userMenu = screen.getByTestId('user-menu');
    await userEvent.click(userMenu);
    const userMenuList = screen.getByTestId('user-menu-list');
    const iconChevronUp = screen.getByTestId('user-menu-up');
    expect(userMenuList).toBeInTheDocument();
    expect(iconChevronUp).toBeInTheDocument();
  });

  test('should navigate to user profile', async () => {
    const { history } = makeSut(mockAccountWithSpotifyModel());
    await userEvent.click(screen.getByTestId('user-menu'));
    await userEvent.click(screen.getByTestId('user-profile'));
    expect(history.location.pathname).toBe('/profile');
  });

  test('should log user out', async () => {
    const { history, setCurrentAccountMock } = makeSut();
    await userEvent.click(screen.getByTestId('logout'));
    expect(setCurrentAccountMock).toHaveBeenLastCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
  });

  test('should show render small layout', () => {
    window = Object.assign(window, { innerWidth: 766 });
    makeSut();
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'small');
    expect(screen.getByTestId('home')).toHaveAttribute('data-size', 'small');
    expect(screen.getByTestId('home-text')).toHaveStyle('display: none');
  });

  test('should redirect user to spotify authorize login url on spotify link', async () => {
    const { spotifyAuthorizeSpy } = makeSut();
    const spotifyButton = screen.getByTestId('link-spotify');
    await userEvent.click(spotifyButton);
    expect(spotifyAuthorizeSpy.callsCount).toBe(1);
  });

  test('should call load music and render music with name, author and thumbnail', async () => {
    const { loadMusicSpy } = makeSut();
    expect(loadMusicSpy.callsCount).toBe(1);
    const player = await screen.findByTestId('player');
    await waitFor(() => player);
    const song = loadMusicSpy.music?.name.split('-') as string[];
    expect(screen.getByTestId('music-name')).toHaveTextContent(song[1].trim());
    expect(screen.getByTestId('music-author')).toHaveTextContent(song[0].trim());
    expect(screen.getByTestId('music-thumbnail')).toHaveAttribute('src', loadMusicSpy.music?.thumbnail as string);
  });

  test('should call load music and render music with name, author and fallback thumbnail', async () => {
    const loadMusicSpy = new LoadMusicSpy();
    const musicModel = mockMusicModel();
    delete musicModel?.thumbnail;
    jest.spyOn(loadMusicSpy, 'load').mockResolvedValueOnce(musicModel);
    makeSut(mockAccountModel(), loadMusicSpy);
    const player = await screen.findByTestId('player');
    await waitFor(() => player);
    const song = musicModel?.name.split('-') as string[];
    expect(screen.getByTestId('music-name')).toHaveTextContent(song[1].trim());
    expect(screen.getByTestId('music-author')).toHaveTextContent(song[0].trim());
    expect(screen.getByTestId('music-thumbnail')).toHaveAttribute('src', 'https://via.placeholder.com/150');
  });

  test('should render music with name and author unknown if no - is found', async () => {
    const loadMusicSpy = new LoadMusicSpy();
    const songName = faker.name.firstName();
    jest.spyOn(loadMusicSpy, 'load').mockResolvedValueOnce(
      Object.assign({}, mockMusicModel(), {
        name: songName
      })
    );
    makeSut(mockAccountModel(), loadMusicSpy);
    const player = await screen.findByTestId('player');
    await waitFor(() => player);
    expect(screen.getByTestId('music-name')).toHaveTextContent(songName);
    expect(screen.getByTestId('music-author')).toHaveTextContent('Unknown');
  });

  test('should not set music with name and author if load music returns null', async () => {
    const loadMusicSpy = new LoadMusicSpy();
    jest.spyOn(loadMusicSpy, 'load').mockResolvedValueOnce(null);
    makeSut(mockAccountModel(), loadMusicSpy);
    const player = await screen.findByTestId('player');
    await waitFor(() => player);
    expect(screen.getByTestId('music-name')).toHaveTextContent('Not Playing');
    expect(screen.getByTestId('music-author')).toHaveTextContent('-');
  });

  test('should show render small layout then resize to a big one', async () => {
    window = Object.assign(window, { innerWidth: 766 });
    makeSut();
    const botName = screen.getByTestId('bot-logo');
    await userEvent.click(botName);
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'large');
  });
});
