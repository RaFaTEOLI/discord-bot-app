import { AccessTokenExpiredError } from '@/domain/errors';
import { LoadUserSpy } from '@/domain/mocks';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { setTimeout } from 'timers/promises';
import Profile from './profile';

type SutTypes = {
  history: MemoryHistory;
  loadUserSpy: LoadUserSpy;
};

const history = createMemoryHistory({ initialEntries: ['/profile'] });
const makeSut = (error: Error | undefined = undefined): SutTypes => {
  const loadUserSpy = new LoadUserSpy();
  if (error) {
    jest.spyOn(loadUserSpy, 'load').mockRejectedValueOnce(error);
  }
  renderWithHistory({
    history,
    useAct: true,
    Page: () =>
      Profile({
        loadUser: loadUserSpy
      })
  });
  return { history, loadUserSpy };
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

describe('Profile Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have profile page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Profile'
    });
    const loading = screen.getByTestId('loading');
    expect(pageContent).toBeInTheDocument();
    expect(loading).toBeInTheDocument();
  });

  test('should call LoadUser on load', () => {
    const { loadUserSpy } = makeSut();
    expect(loadUserSpy.callsCount).toBe(1);
  });

  test('should show user info', async () => {
    const { loadUserSpy } = makeSut();
    await waitFor(() => screen.getByTestId('info'));
    expect(screen.getByTestId('name')).toHaveTextContent(loadUserSpy.spotifyUser.display_name);
    expect(screen.getByTestId('email')).toHaveTextContent(loadUserSpy.spotifyUser.email);
  });

  test('should show error if LoadUser fails', async () => {
    makeSut(new Error());
    await setTimeout(3000);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Load Profile Error',
      description: 'There was an error while trying to load your profile',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right'
    });
  });

  test('should navigate to login page if LoadUser returns AccessTokenExpiredError', async () => {
    const { history } = makeSut(new AccessTokenExpiredError());
    await setTimeout(3000);
    expect(history.location.pathname).toBe('/login');
  });
});
