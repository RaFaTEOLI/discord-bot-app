import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { LoadPlaylistTracksSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { setTimeout } from 'timers/promises';
import Playlist from './playlist';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  history: MemoryHistory;
  loadPlaylistTracks: LoadPlaylistTracksSpy;
};

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
});
