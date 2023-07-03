import { AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { RunCommandSpy, SpotifyRefreshTokenSpy, SpotifySearchSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Browse from './browse';
import { setTimeout } from 'timers/promises';
import { faker } from '@faker-js/faker';
import { SpotifySearch } from '@/domain/usecases';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  getCurrentAccountMock: () => AccountModel;
  history: MemoryHistory;
  spotifySearchSpy: SpotifySearchSpy;
  runCommandSpy: RunCommandSpy;
  refreshTokenSpy: SpotifyRefreshTokenSpy | undefined;
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
const history = createMemoryHistory({ initialEntries: ['/browse'] });
const makeSut = (
  spotifySearchSpy = new SpotifySearchSpy(),
  runCommandSpy = new RunCommandSpy(),
  refreshTokenSpy?: SpotifyRefreshTokenSpy | undefined
): SutTypes => {
  const { setCurrentAccountMock, getCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    spotifyUser: !!refreshTokenSpy,
    Page: () =>
      Browse({
        spotifySearch: spotifySearchSpy,
        runCommand: runCommandSpy,
        refreshToken: refreshTokenSpy ?? new SpotifyRefreshTokenSpy()
      })
  });
  return { setCurrentAccountMock, spotifySearchSpy, history, runCommandSpy, refreshTokenSpy, getCurrentAccountMock };
};

describe('Browse Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have browse page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Browse'
    });
    expect(pageContent).toBeInTheDocument();
  });

  test('should call SpotifySearch', async () => {
    const { spotifySearchSpy } = makeSut();
    await waitFor(() => screen.getByTestId('browse-container'));
    await userEvent.click(screen.getByTestId('search-song-button'));
    expect(spotifySearchSpy.callsCount).toBe(1);
  });

  test('should render error on UnexpectedError on SpotifySearch', async () => {
    const spotifySearchSpy = new SpotifySearchSpy();
    const error = new UnexpectedError();
    jest.spyOn(spotifySearchSpy, 'search').mockRejectedValueOnce(error);
    makeSut(spotifySearchSpy);
    await waitFor(() => screen.getByTestId('browse-container'));
    await userEvent.click(screen.getByTestId('search-song-button'));
    await setTimeout(500);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Server Error',
      description: 'Something went wrong while trying to search',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should show all tracks', async () => {
    makeSut();
    const searchInput = screen.getByTestId('search-song-input');
    const noun = faker.word.noun();
    await userEvent.type(searchInput, noun);
    await userEvent.click(screen.getByTestId('search-song-button'));

    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);

    expect(tracksList.children).toHaveLength(1);
  });

  test('should show no tracks', async () => {
    const spotifySearchSpy = new SpotifySearchSpy();
    jest.spyOn(spotifySearchSpy, 'search').mockResolvedValueOnce(undefined as unknown as SpotifySearch.Model);
    makeSut(spotifySearchSpy);
    const searchInput = screen.getByTestId('search-song-input');
    const noun = faker.word.noun();
    await userEvent.type(searchInput, noun);
    await userEvent.click(screen.getByTestId('search-song-button'));

    const noContent = screen.getByRole('heading', {
      name: 'Nothing to show...'
    });
    expect(noContent).toBeInTheDocument();
  });

  test('should show track from TracksList', async () => {
    const { spotifySearchSpy } = makeSut();
    const searchInput = screen.getByTestId('search-song-input');
    const noun = faker.word.noun();
    await userEvent.type(searchInput, noun);
    await userEvent.click(screen.getByTestId('search-song-button'));
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    const artistName = spotifySearchSpy.spotifySearch.tracks.items[0].artists[0].name;
    const trackName = spotifySearchSpy.spotifySearch.tracks.items[0].name;
    expect(tracksList.children).toHaveLength(1);
    expect(tracksList.querySelector('.track-name')).toHaveTextContent(trackName);
    expect(tracksList.querySelector('.track-artist')).toHaveTextContent(artistName);
  });

  test('should call RunCommand with song', async () => {
    const { runCommandSpy, spotifySearchSpy } = makeSut();
    const searchInput = screen.getByTestId('search-song-input');
    const noun = faker.word.noun();
    await userEvent.type(searchInput, noun);
    await userEvent.click(screen.getByTestId('search-song-button'));
    const runSpy = jest.spyOn(runCommandSpy, 'run');
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    await userEvent.click(tracksList.querySelectorAll('.song-play-button')[0]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-cancel-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(1);
    expect(runSpy).toHaveBeenCalledWith(`play ${spotifySearchSpy.spotifySearch.tracks.items[0].external_urls.spotify}`);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Song Added',
      description: 'Your song was successfully added to the queue',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should call toast with error values if RunCommand with song fails', async () => {
    const runCommandSpy = new RunCommandSpy();
    jest.spyOn(runCommandSpy, 'run').mockRejectedValueOnce(new Error());
    makeSut(new SpotifySearchSpy(), runCommandSpy);
    const searchInput = screen.getByTestId('search-song-input');
    const noun = faker.word.noun();
    await userEvent.type(searchInput, noun);
    await userEvent.click(screen.getByTestId('search-song-button'));
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    await userEvent.click(tracksList.querySelectorAll('.song-play-button')[0]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-cancel-button'));
    await setTimeout(1000);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Add Song Error',
      description: 'There was an error while trying to add your song to the queue',
      status: 'error',
      duration: 9000,
      position: 'top',
      isClosable: true
    });
  });

  test('should call RunCommand with stop and song', async () => {
    const { runCommandSpy, spotifySearchSpy } = makeSut();
    const searchInput = screen.getByTestId('search-song-input');
    const noun = faker.word.noun();
    await userEvent.type(searchInput, noun);
    await userEvent.click(screen.getByTestId('search-song-button'));
    const runSpy = jest.spyOn(runCommandSpy, 'run');
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    await userEvent.click(tracksList.querySelectorAll('.song-play-button')[0]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-confirm-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(2);
    expect(runSpy).toHaveBeenCalledWith(`play ${spotifySearchSpy.spotifySearch.tracks.items[0].external_urls.spotify}`);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Song Added',
      description: 'Your song was successfully added to the queue',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should show toast and refresh spotify access token when a refresh token is present', async () => {
    const spotifySearchSpy = new SpotifySearchSpy();
    jest.spyOn(spotifySearchSpy, 'search').mockRejectedValueOnce(new AccessTokenExpiredError());
    const refreshTokenSpy = new SpotifyRefreshTokenSpy();
    const { setCurrentAccountMock, getCurrentAccountMock } = makeSut(spotifySearchSpy, new RunCommandSpy(), refreshTokenSpy);
    await waitFor(() => screen.getByTestId('browse-container'));
    await userEvent.click(screen.getByTestId('search-song-button'));
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
    expect(history.location.pathname).toBe('/browse');
  });
});
