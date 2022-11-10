import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Home from './home';

const history = createMemoryHistory({ initialEntries: ['/'] });
const makeSut = (): void => {
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Home()
  });
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have home page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Home'
    });
    expect(pageContent).toBeInTheDocument();
  });
});
