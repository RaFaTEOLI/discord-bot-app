/* eslint-disable no-global-assign */
import { renderWithHistory } from '@/presentation/mocks';
import { createMemoryHistory, MemoryHistory } from 'history';
import SpotifyContainer from './spotify-container';
import { SpotifyRequestTokenSpy } from '@/domain/mocks';
import { Authentication } from '@/domain/usecases';
import { setTimeout } from 'timers/promises';

type SutTypes = {
  setCurrentAccountMock: (account: Authentication.Model) => void;
  spotifyRequestTokenSpy: SpotifyRequestTokenSpy;
};

const historyEmpty = createMemoryHistory({ initialEntries: ['/'] });
const historyWithLoginSpotifyLogin = createMemoryHistory({ initialEntries: ['/login?code=any_code&state=any_state'] });
const historyWithSignUpSpotifyLogin = createMemoryHistory({ initialEntries: ['/signup?code=any_code&state=any_state'] });
const historyWithSpotifyLogin = createMemoryHistory({ initialEntries: ['?code=any_code&state=any_state'] });

const makeSut = (memoryHistory: MemoryHistory = historyWithLoginSpotifyLogin, error = false): SutTypes => {
  const spotifyRequestTokenSpy = new SpotifyRequestTokenSpy();
  if (error) {
    jest.spyOn(spotifyRequestTokenSpy, 'request').mockRejectedValueOnce(new Error());
  }
  const { setCurrentAccountMock } = renderWithHistory({
    history: memoryHistory,
    Page: () => SpotifyContainer({ spotifyRequestToken: spotifyRequestTokenSpy })
  });
  return { setCurrentAccountMock, spotifyRequestTokenSpy };
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

describe('Spotify Container Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should login into spotify if redirect is received from login page', async () => {
    const { setCurrentAccountMock, spotifyRequestTokenSpy } = makeSut();
    expect(spotifyRequestTokenSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(spotifyRequestTokenSpy.access);
    expect(historyWithLoginSpotifyLogin.location.pathname).toBe('/');
  });

  test('should login into spotify if redirect is received from signup page', async () => {
    const { setCurrentAccountMock, spotifyRequestTokenSpy } = makeSut(historyWithSignUpSpotifyLogin);
    expect(spotifyRequestTokenSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(spotifyRequestTokenSpy.access);
    expect(historyWithSignUpSpotifyLogin.location.pathname).toBe('/');
  });

  test('should login into spotify if redirect is received from any page', async () => {
    const { setCurrentAccountMock, spotifyRequestTokenSpy } = makeSut(historyWithSpotifyLogin);
    expect(spotifyRequestTokenSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(spotifyRequestTokenSpy.access);
  });

  test('should show toast error if spotify fails', async () => {
    const { setCurrentAccountMock } = makeSut(historyWithSpotifyLogin, true);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledTimes(0);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Login Error',
      description: 'There was an error while trying to login with Spotify.',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should not login into spotify if no redirect is received from any page', async () => {
    const { setCurrentAccountMock, spotifyRequestTokenSpy } = makeSut(historyEmpty);
    expect(spotifyRequestTokenSpy.callsCount).toBe(0);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledTimes(0);
  });
});
