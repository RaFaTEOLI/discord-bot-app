import { LoadPlaylistTracksSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
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
});
