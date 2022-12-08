import { LoadUserPlaylistSpy } from '@/domain/mocks';
import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Playlists from './playlists';

type SutTypes = {
  loadUserPlaylistsSpy: LoadUserPlaylistSpy;
};

const history = createMemoryHistory({ initialEntries: ['/playlists'] });
const makeSut = (): SutTypes => {
  const loadUserPlaylistsSpy = new LoadUserPlaylistSpy();
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Playlists({ loadUserPlaylists: loadUserPlaylistsSpy })
  });
  return { loadUserPlaylistsSpy };
};

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
});
