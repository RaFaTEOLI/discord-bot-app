import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Playlist from './playlist';

const history = createMemoryHistory({ initialEntries: ['/playlists/1'] });
const makeSut = (): void => {
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Playlist()
  });
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
});
