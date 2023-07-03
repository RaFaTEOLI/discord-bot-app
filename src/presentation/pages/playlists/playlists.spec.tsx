import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadUserPlaylistsSpy, RunCommandSpy, SpotifyRefreshTokenSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { setTimeout } from 'timers/promises';
import userEvent from '@testing-library/user-event';
import Playlists from './playlists';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  getCurrentAccountMock: () => AccountModel;
  history: MemoryHistory;
  loadUserPlaylistsSpy: LoadUserPlaylistsSpy;
  runCommandSpy: RunCommandSpy;
  refreshTokenSpy: SpotifyRefreshTokenSpy | undefined;
};

const history = createMemoryHistory({ initialEntries: ['/playlists'] });
const makeSut = (
  loadUserPlaylistsSpy = new LoadUserPlaylistsSpy(),
  runCommandSpy = new RunCommandSpy(),
  refreshTokenSpy?: SpotifyRefreshTokenSpy | undefined
): SutTypes => {
  const { setCurrentAccountMock, getCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    spotifyUser: !!refreshTokenSpy,
    Page: () =>
      Playlists({
        loadUserPlaylists: loadUserPlaylistsSpy,
        runCommand: runCommandSpy,
        refreshToken: refreshTokenSpy ?? new SpotifyRefreshTokenSpy()
      })
  });
  return { setCurrentAccountMock, loadUserPlaylistsSpy, runCommandSpy, history, refreshTokenSpy, getCurrentAccountMock };
};

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    __esModule: true,
    ...originalModule,
    useToast: jest.fn().mockImplementation(() => mockToast)
  };
});
describe('Playlists Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have Playlists page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Playlists'
    });
    expect(pageContent).toBeInTheDocument();
  });

  test('should call LoadUserPlaylist', () => {
    const { loadUserPlaylistsSpy } = makeSut();
    expect(loadUserPlaylistsSpy.callsCount).toBe(1);
  });

  test('should render error on UnexpectedError on LoadUserPlaylist', async () => {
    const loadUserPlaylistsSpy = new LoadUserPlaylistsSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadUserPlaylistsSpy, 'all').mockRejectedValueOnce(error);
    makeSut(loadUserPlaylistsSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('playlists-list')).not.toBeInTheDocument();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap).toHaveTextContent(error.message);
  });

  test('should render error on AccessDeniedError on LoadUserPlaylist', async () => {
    const loadUserPlaylistsSpy = new LoadUserPlaylistsSpy();
    jest.spyOn(loadUserPlaylistsSpy, 'all').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut(loadUserPlaylistsSpy);
    await waitFor(() => screen.getByRole('heading'));
    await setTimeout(500);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
  });

  test('should show toast and refresh spotify access token when a refresh token is present', async () => {
    const loadUserPlaylistsSpy = new LoadUserPlaylistsSpy();
    jest.spyOn(loadUserPlaylistsSpy, 'all').mockRejectedValueOnce(new AccessTokenExpiredError());
    const refreshTokenSpy = new SpotifyRefreshTokenSpy();
    const { setCurrentAccountMock, getCurrentAccountMock } = makeSut(
      loadUserPlaylistsSpy,
      new RunCommandSpy(),
      refreshTokenSpy
    );
    await setTimeout(2000);
    expect(refreshTokenSpy?.callsCount).toBe(1);
    expect(setCurrentAccountMock).toHaveBeenCalledWith({
      ...getCurrentAccountMock(),
      user: {
        ...getCurrentAccountMock().user,
        spotify: {
          ...getCurrentAccountMock().user.spotify,
          accessToken: refreshTokenSpy?.access.accessToken,
          refreshToken: ''
        }
      }
    });
    expect(history.location.pathname).toBe('/playlists');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Access Denied',
      description: 'Your login with spotify is either expired or invalid, please log in with spotify again!',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should show toast and redirect user to login if spotify access token is expired', async () => {
    const loadUserPlaylistsSpy = new LoadUserPlaylistsSpy();
    jest.spyOn(loadUserPlaylistsSpy, 'all').mockRejectedValueOnce(new AccessTokenExpiredError());
    const { setCurrentAccountMock } = makeSut(loadUserPlaylistsSpy);
    await setTimeout(2000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Access Denied',
      description: 'Your login with spotify is either expired or invalid, please log in with spotify again!',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should call LoadUserPlaylist on reload', async () => {
    const loadUserPlaylistsSpy = new LoadUserPlaylistsSpy();
    jest.spyOn(loadUserPlaylistsSpy, 'all').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadUserPlaylistsSpy);
    await waitFor(() => screen.getByTestId('error'));
    await userEvent.click(screen.getByTestId('reload'));
    await waitFor(() => screen.getByTestId('playlists-list'));
    expect(loadUserPlaylistsSpy.callsCount).toBe(2);
  });

  test('should have only one playlist filtered from PlaylistList by playlist name', async () => {
    const { loadUserPlaylistsSpy } = makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    const inputFilter = screen.getByTestId('filter-playlist-input');
    await userEvent.type(inputFilter, loadUserPlaylistsSpy.spotifyUserPlaylists.items[0].name);
    expect(playlistsList.children).toHaveLength(1);
    expect(playlistsList.querySelector('.playlist-name')).toHaveTextContent(
      loadUserPlaylistsSpy.spotifyUserPlaylists.items[0].name
    );
    expect(playlistsList.querySelector('.playlist-description')).toHaveTextContent(
      loadUserPlaylistsSpy.spotifyUserPlaylists.items[0].description
    );
  });

  test('should show all playlists from PlaylistList if empty filter is provided', async () => {
    makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    const inputFilter = screen.getByTestId('filter-playlist-input');
    await userEvent.type(inputFilter, ' ');
    expect(playlistsList.children).toHaveLength(5);
  });

  test('should show zero playlists from PlaylistList if filter does not match with any playlist', async () => {
    makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    const inputFilter = screen.getByTestId('filter-playlist-input');
    await userEvent.type(inputFilter, 'INVALID FILTER');
    expect(playlistsList.children).toHaveLength(0);
  });

  test('should only one playlist filtered from PlaylistList by playlist description', async () => {
    const { loadUserPlaylistsSpy } = makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    const inputFilter = screen.getByTestId('filter-playlist-input');
    await userEvent.type(inputFilter, loadUserPlaylistsSpy.spotifyUserPlaylists.items[2].description);
    expect(playlistsList.children).toHaveLength(1);
    expect(playlistsList.querySelector('.playlist-name')).toHaveTextContent(
      loadUserPlaylistsSpy.spotifyUserPlaylists.items[2].name
    );
    expect(playlistsList.querySelector('.playlist-description')).toHaveTextContent(
      loadUserPlaylistsSpy.spotifyUserPlaylists.items[2].description
    );
  });

  test('should call RunCommand with stop and playlist', async () => {
    const { runCommandSpy, loadUserPlaylistsSpy } = makeSut();
    const runSpy = jest.spyOn(runCommandSpy, 'run');
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    await userEvent.click(playlistsList.querySelectorAll('.playlist-play-button')[1]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-confirm-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(2);
    expect(runSpy).toHaveBeenCalledWith(
      `playlist ${loadUserPlaylistsSpy.spotifyUserPlaylists.items[1].external_urls.spotify}`
    );
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Playlist Added',
      description: 'Your playlist was successfully added to the queue',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should call RunCommand with playlist', async () => {
    const { runCommandSpy, loadUserPlaylistsSpy } = makeSut();
    const runSpy = jest.spyOn(runCommandSpy, 'run');
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    await userEvent.click(playlistsList.querySelectorAll('.playlist-play-button')[1]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-cancel-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(1);
    expect(runSpy).toHaveBeenCalledWith(
      `playlist ${loadUserPlaylistsSpy.spotifyUserPlaylists.items[1].external_urls.spotify}`
    );
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Playlist Added',
      description: 'Your playlist was successfully added to the queue',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should call toast with error values if RunCommand fails', async () => {
    const runCommandSpy = new RunCommandSpy();
    jest.spyOn(runCommandSpy, 'run').mockRejectedValueOnce(new Error());
    makeSut(new LoadUserPlaylistsSpy(), runCommandSpy);
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    await userEvent.click(playlistsList.querySelectorAll('.playlist-play-button')[1]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-cancel-button'));
    await setTimeout(1000);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Add Playlist Error',
      description: 'There was an error while trying to add your playlist to the queue',
      status: 'error',
      duration: 9000,
      position: 'top',
      isClosable: true
    });
  });

  test('should navigate to playlists page with id', async () => {
    const { loadUserPlaylistsSpy } = makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    await userEvent.click(playlistsList.querySelectorAll('.playlist-view-button')[0]);
    expect(history.location.pathname).toBe(`/playlists/${loadUserPlaylistsSpy.spotifyUserPlaylists.items[0].id}`);
  });

  test('should show play icon when hovering playlist card', async () => {
    makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    await userEvent.hover(playlistsList.querySelectorAll('.playlist-play-button')[0]);
    await setTimeout(1000);
    expect(playlistsList.querySelectorAll('.playlist-play-button')[0]).toBeVisible();
  });

  test('should show play icon then hide after unhovering playlist card', async () => {
    makeSut();
    const playlistsList = await screen.findByTestId('playlists-list');
    await waitFor(() => playlistsList);
    await userEvent.hover(playlistsList.querySelectorAll('.playlist-play-button')[0]);
    await setTimeout(1000);
    expect(playlistsList.querySelectorAll('.playlist-play-button')[0]).toBeVisible();
    await userEvent.unhover(playlistsList.querySelectorAll('.playlist-play-button')[0]);
    expect(playlistsList.querySelectorAll('.playlist-play-button')[0]).not.toBeVisible();
  });
});
