import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadPlaylistTracksSpy, mockSpotifyPlaylistTracksList } from '@/domain/mocks';
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
  loadPlaylistTracks: LoadPlaylistTracksSpy;
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
const makeSut = (loadPlaylistTracks = new LoadPlaylistTracksSpy()): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Playlist({ loadPlaylistTracks })
  });
  return { setCurrentAccountMock, loadPlaylistTracks, history };
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
    const { loadPlaylistTracks } = makeSut();
    expect(loadPlaylistTracks.callsCount).toBe(1);
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
    const playlist = mockSpotifyPlaylistTracksList();
    const loadPlaylistTracks = new LoadPlaylistTracksSpy();
    jest.spyOn(loadPlaylistTracks, 'load').mockResolvedValueOnce(playlist);
    makeSut(loadPlaylistTracks);
    const playlistHeader = await screen.findByTestId('playlist-header');
    await waitFor(() => playlistHeader);
    expect(screen.getByTestId('playlist-image-url')).toHaveAttribute('src', playlist.images[0].url);
    expect(screen.getByTestId('playlist-name')).toHaveTextContent(playlist.name);
    expect(screen.getByTestId('playlist-description')).toHaveTextContent(playlist.description);
    expect(screen.getByTestId('playlist-song-count')).toHaveTextContent(playlist.tracks.total.toString());
  });

  test('should show all tracks if empty filter is provided', async () => {
    makeSut();
    const tracksList = await screen.findByTestId('tracks-list');
    await waitFor(() => tracksList);
    const inputFilter = screen.getByTestId('filter-track-input');
    await userEvent.type(inputFilter, ' ');
    expect(tracksList.children).toHaveLength(100);
  });
});
