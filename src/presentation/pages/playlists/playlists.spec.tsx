import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Playlists from './playlists';

const history = createMemoryHistory({ initialEntries: ['/playlists'] });
const makeSut = (): void => {
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Playlists()
  });
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
});
