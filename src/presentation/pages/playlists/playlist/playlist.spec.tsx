import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadPlaylistTracksSpy, RunCommandSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { setTimeout } from 'timers/promises';
import Playlist from './playlist';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  history: MemoryHistory;
  loadPlaylistTracksSpy: LoadPlaylistTracksSpy;
  runCommandSpy: RunCommandSpy;
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
const history = createMemoryHistory({ initialEntries: ['/playlists/1'] });
const makeSut = (loadPlaylistTracksSpy = new LoadPlaylistTracksSpy(), runCommandSpy = new RunCommandSpy()): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Playlist({ loadPlaylistTracks: loadPlaylistTracksSpy, runCommand: runCommandSpy })
  });
  return { setCurrentAccountMock, loadPlaylistTracksSpy, runCommandSpy, history };
};

describe('Playlist Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have playlist page content', () => {
    makeSut();
    const pageContent = screen.getByTestId('playlist-container');
    expect(pageContent).toBeInTheDocument();
  });

  test('should call LoadPlaylistTracks', () => {
    const { loadPlaylistTracksSpy } = makeSut();
    expect(loadPlaylistTracksSpy.callsCount).toBe(1);
  });

  test('should render error on UnexpectedError on LoadPlaylistTracks', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(error);
    makeSut(loadPlaylistTracksSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('playlists-list')).not.toBeInTheDocument();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap).toHaveTextContent(error.message);
  });

  test('should render error on AccessDeniedError on LoadPlaylistTracks', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    jest.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut(loadPlaylistTracksSpy);
    await waitFor(() => screen.getByTestId('playlist-container'));
    await setTimeout(500);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
  });

  test('should show toast and redirect user to login if spotify access token is expired', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    jest.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new AccessTokenExpiredError());
    const { setCurrentAccountMock } = makeSut(loadPlaylistTracksSpy);
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

  test('should call LoadPlaylistTracks on reload', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    jest.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadPlaylistTracksSpy);
    await waitFor(() => screen.getByTestId('error'));
    await userEvent.click(screen.getByTestId('reload'));
    await waitFor(() => screen.getByTestId('playlist-header'));
    expect(loadPlaylistTracksSpy.callsCount).toBe(2);
  });

  test('should show playlist info', async () => {
    const { loadPlaylistTracksSpy } = makeSut();
    const playlistHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistHeader);
    expect(screen.getByTestId('playlist-image-url')).toHaveAttribute(
      'src',
      loadPlaylistTracksSpy.spotifyUserPlaylists.images[0].url
    );
    expect(screen.getByTestId('playlist-name')).toHaveTextContent(loadPlaylistTracksSpy.spotifyUserPlaylists.name);
    expect(screen.getByTestId('playlist-description')).toHaveTextContent(
      loadPlaylistTracksSpy.spotifyUserPlaylists.description
    );
    expect(screen.getByTestId('playlist-song-count')).toHaveTextContent(
      loadPlaylistTracksSpy.spotifyUserPlaylists.tracks.total.toString()
    );
  });

  test('should show all tracks if empty filter is provided', async () => {
    makeSut();
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    const inputFilter = screen.getByTestId('filter-track-input');
    await userEvent.type(inputFilter, ' ');
    expect(tracksList.children).toHaveLength(100);
  });

  test('should show zero tracks from TracksList if filter does not match with any track', async () => {
    makeSut();
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    const inputFilter = screen.getByTestId('filter-track-input');
    await userEvent.type(inputFilter, 'INVALID FILTER');
    expect(tracksList.children).toHaveLength(0);
  });

  test('should only one track filtered from TracksList by track artist', async () => {
    const { loadPlaylistTracksSpy } = makeSut();
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    const inputFilter = screen.getByTestId('filter-track-input');
    if (loadPlaylistTracksSpy.spotifyUserPlaylists.tracks?.items) {
      const artistName = loadPlaylistTracksSpy.spotifyUserPlaylists.tracks?.items[2].track.artists[0].name;
      const trackName = loadPlaylistTracksSpy.spotifyUserPlaylists.tracks?.items[2].track.name;
      await userEvent.type(inputFilter, artistName);
      expect(tracksList.children).toHaveLength(1);
      expect(tracksList.querySelector('.track-name')).toHaveTextContent(trackName);
      expect(tracksList.querySelector('.track-artist')).toHaveTextContent(artistName);
    }
  });

  test('should call RunCommand with playlist', async () => {
    const { runCommandSpy, loadPlaylistTracksSpy } = makeSut();
    const runSpy = jest.spyOn(runCommandSpy, 'run');
    const playlistHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistHeader);
    await userEvent.click(screen.getByTestId('playlist-play-button'));
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-cancel-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(1);
    expect(runSpy).toHaveBeenCalledWith(`playlist ${loadPlaylistTracksSpy.spotifyUserPlaylists.external_urls.spotify}`);
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
    makeSut(new LoadPlaylistTracksSpy(), runCommandSpy);
    const playlistsHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistsHeader);
    await userEvent.click(screen.getByTestId('playlist-play-button'));
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
});
