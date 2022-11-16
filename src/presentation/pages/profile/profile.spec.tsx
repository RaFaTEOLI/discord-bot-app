import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Profile from './profile';

const history = createMemoryHistory({ initialEntries: ['/profile'] });
const makeSut = (): void => {
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Profile()
  });
};

describe('Profile Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have commands page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Profile'
    });
    expect(pageContent).toBeInTheDocument();
  });
});
