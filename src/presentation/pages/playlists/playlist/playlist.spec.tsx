import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import {
  LoadPlaylistTracksSpy,
  LoadUserByIdSpy,
  mockSpotifyUserById,
  RunCommandSpy,
  SpotifyRefreshTokenSpy
} from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { setTimeout } from 'timers/promises';
import Playlist from './playlist';
import { describe, test, expect, vi, beforeEach } from 'vitest';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  getCurrentAccountMock: () => AccountModel;
  history: MemoryHistory;
  loadPlaylistTracksSpy: LoadPlaylistTracksSpy;
  runCommandSpy: RunCommandSpy;
  loadUserByIdSpy: LoadUserByIdSpy;
  refreshTokenSpy: SpotifyRefreshTokenSpy | undefined;
};

const mockToast = vi.fn();
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...(actual as any),
    useToast: vi.fn().mockImplementation(() => mockToast)
  };
});
const history = createMemoryHistory({ initialEntries: ['/playlists/1'] });
const makeSut = (
  loadPlaylistTracksSpy = new LoadPlaylistTracksSpy(),
  runCommandSpy = new RunCommandSpy(),
  loadUserByIdSpy = new LoadUserByIdSpy(),
  refreshTokenSpy?: SpotifyRefreshTokenSpy | undefined
): SutTypes => {
  const { setCurrentAccountMock, getCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    spotifyUser: !!refreshTokenSpy,
    Page: () =>
      Playlist({
        loadPlaylistTracks: loadPlaylistTracksSpy,
        runCommand: runCommandSpy,
        loadUserById: loadUserByIdSpy,
        refreshToken: refreshTokenSpy ?? new SpotifyRefreshTokenSpy()
      })
  });
  return {
    setCurrentAccountMock,
    getCurrentAccountMock,
    loadPlaylistTracksSpy,
    runCommandSpy,
    loadUserByIdSpy,
    history,
    refreshTokenSpy
  };
};

describe('Playlist Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have playlist page content', () => {
    makeSut();
    const pageContent = screen.getByTestId('playlist-container');
    expect(pageContent).toBeTruthy();
  });

  test('should call LoadPlaylistTracks', () => {
    const { loadPlaylistTracksSpy } = makeSut();
    expect(loadPlaylistTracksSpy.callsCount).toBe(1);
  });

  test('should show toast and refresh spotify access token when a refresh token is present', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    vi.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new AccessTokenExpiredError());
    const { setCurrentAccountMock, refreshTokenSpy, getCurrentAccountMock } = makeSut(
      loadPlaylistTracksSpy,
      new RunCommandSpy(),
      new LoadUserByIdSpy(),
      new SpotifyRefreshTokenSpy()
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
    expect(history.location.pathname).toBe('/playlists/1');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Access Denied',
      description: 'Your login with spotify is either expired or invalid, please log in with spotify again!',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should render error on UnexpectedError on LoadPlaylistTracks', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    const error = new UnexpectedError();
    vi.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(error);
    makeSut(loadPlaylistTracksSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('playlists-list')).not.toBeTruthy();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap.textContent).toBe(`${error.message}Try again`);
  });

  test('should render error on AccessDeniedError on LoadPlaylistTracks', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    vi.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut(loadPlaylistTracksSpy);
    await waitFor(() => screen.getByTestId('playlist-container'));
    await setTimeout(500);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
  });

  test('should show toast and redirect user to login if spotify access token is expired and no refreshToken is present', async () => {
    const loadPlaylistTracksSpy = new LoadPlaylistTracksSpy();
    vi.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new AccessTokenExpiredError());
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
    vi.spyOn(loadPlaylistTracksSpy, 'load').mockRejectedValueOnce(new UnexpectedError());
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
    expect(screen.getByTestId('playlist-image-url').getAttribute('src')).toBe(
      loadPlaylistTracksSpy.spotifyUserPlaylists.images[0].url
    );
    expect(screen.getByTestId('playlist-name').textContent).toBe(loadPlaylistTracksSpy.spotifyUserPlaylists.name);
    expect(screen.getByTestId('playlist-description').textContent).toBe(
      loadPlaylistTracksSpy.spotifyUserPlaylists.description
    );
    expect(screen.getByTestId('playlist-song-count').textContent).toBe(
      `${
        loadPlaylistTracksSpy.spotifyUserPlaylists.owner.display_name
      } • ${loadPlaylistTracksSpy.spotifyUserPlaylists.tracks.total.toString()} Songs`
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
      expect(tracksList.querySelector('.track-name')?.textContent).toBe(trackName);
      expect(tracksList.querySelector('.track-artist')?.textContent).toBe(artistName);
    }
  });

  test('should call RunCommand with playlist', async () => {
    const { runCommandSpy, loadPlaylistTracksSpy } = makeSut();
    const runSpy = vi.spyOn(runCommandSpy, 'run');
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
    vi.spyOn(runCommandSpy, 'run').mockRejectedValueOnce(new Error());
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

  test('should call RunCommand with song', async () => {
    const { runCommandSpy, loadPlaylistTracksSpy } = makeSut();
    const runSpy = vi.spyOn(runCommandSpy, 'run');
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    await userEvent.click(tracksList.querySelectorAll('.song-play-button')[1]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-cancel-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(1);
    expect(runSpy).toHaveBeenCalledWith(
      `play ${loadPlaylistTracksSpy.spotifyUserPlaylists.tracks.items[1].track.external_urls.spotify}`
    );
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
    vi.spyOn(runCommandSpy, 'run').mockRejectedValueOnce(new Error());
    makeSut(new LoadPlaylistTracksSpy(), runCommandSpy);
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    await userEvent.click(tracksList.querySelectorAll('.song-play-button')[1]);
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

  test('should call RunCommand with stop and playlist', async () => {
    const { runCommandSpy, loadPlaylistTracksSpy } = makeSut();
    const runSpy = vi.spyOn(runCommandSpy, 'run');
    const playlistHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistHeader);
    await userEvent.click(screen.getByTestId('playlist-play-button'));
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-confirm-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(2);
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

  test('should call RunCommand with stop and song', async () => {
    const { runCommandSpy, loadPlaylistTracksSpy } = makeSut();
    const runSpy = vi.spyOn(runCommandSpy, 'run');
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    await userEvent.click(tracksList.querySelectorAll('.song-play-button')[1]);
    await setTimeout(1000);
    await waitFor(async () => await screen.findByTestId('confirmation-modal-header'));
    await userEvent.click(screen.getByTestId('confirmation-confirm-button'));
    await setTimeout(1000);
    expect(runCommandSpy.callsCount).toBe(2);
    expect(runSpy).toHaveBeenCalledWith(
      `play ${loadPlaylistTracksSpy.spotifyUserPlaylists.tracks.items[1].track.external_urls.spotify}`
    );
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Song Added',
      description: 'Your song was successfully added to the queue',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should call LoadUserById and show user avatar', async () => {
    const { loadUserByIdSpy } = makeSut();
    const playlistHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistHeader);
    expect(loadUserByIdSpy.callsCount).toBe(1);
    expect(screen.getByTestId('playlist-owner-image-url')).toBeTruthy();
  });

  test('should call LoadUserById and show fallback avatar when user does not have one', async () => {
    const loadUserByIdSpy = new LoadUserByIdSpy();
    vi.spyOn(loadUserByIdSpy, 'loadById').mockResolvedValueOnce(Object.assign({}, mockSpotifyUserById(), { images: [] }));
    makeSut(new LoadPlaylistTracksSpy(), new RunCommandSpy(), loadUserByIdSpy);
    const playlistHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistHeader);
    expect(screen.getByTestId('playlist-owner-image-url')).toBeTruthy();
  });
});
