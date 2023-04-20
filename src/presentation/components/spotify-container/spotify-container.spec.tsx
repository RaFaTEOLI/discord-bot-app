/* eslint-disable no-global-assign */
import { renderWithHistory } from '@/presentation/mocks';
import { createMemoryHistory, MemoryHistory } from 'history';
import SpotifyContainer from './spotify-container';
import { SpotifyAuthenticateSpy } from '@/domain/mocks';
import { Authentication } from '@/domain/usecases';
import { setTimeout } from 'timers/promises';
import { InvalidCredentialsError } from '@/domain/errors';

type SutTypes = {
  setCurrentAccountMock: (account: Authentication.Model) => void;
  spotifyAuthenticateLoginSpy: SpotifyAuthenticateSpy;
  spotifyAuthenticateSignUpSpy: SpotifyAuthenticateSpy;
};

const historyEmpty = createMemoryHistory({ initialEntries: ['/'] });
const historyWithLoginSpotifyLogin = createMemoryHistory({ initialEntries: ['/login?code=any_code&state=any_state'] });
const historyWithSignUpSpotifyLogin = createMemoryHistory({ initialEntries: ['/signup?code=any_code&state=any_state'] });
const historyWithSpotifyLogin = createMemoryHistory({ initialEntries: ['?code=any_code&state=any_state'] });

const makeSut = (memoryHistory: MemoryHistory = historyWithLoginSpotifyLogin, error: null | Error = null): SutTypes => {
  const spotifyAuthenticateLoginSpy = new SpotifyAuthenticateSpy();
  const spotifyAuthenticateSignUpSpy = new SpotifyAuthenticateSpy();
  if (error) {
    jest.spyOn(spotifyAuthenticateLoginSpy, 'request').mockRejectedValueOnce(error);
    jest.spyOn(spotifyAuthenticateSignUpSpy, 'request').mockRejectedValueOnce(error);
  }
  const { setCurrentAccountMock } = renderWithHistory({
    history: memoryHistory,
    Page: () =>
      SpotifyContainer({
        spotifyAuthenticateLogin: spotifyAuthenticateLoginSpy,
        spotifyAuthenticateSignUp: spotifyAuthenticateSignUpSpy
      })
  });
  return { setCurrentAccountMock, spotifyAuthenticateLoginSpy, spotifyAuthenticateSignUpSpy };
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
    const { setCurrentAccountMock, spotifyAuthenticateLoginSpy } = makeSut();
    expect(spotifyAuthenticateLoginSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(spotifyAuthenticateLoginSpy.access);
    expect(historyWithLoginSpotifyLogin.location.pathname).toBe('/');
  });

  test('should login into spotify if redirect is received from signup page', async () => {
    const { setCurrentAccountMock, spotifyAuthenticateSignUpSpy } = makeSut(historyWithSignUpSpotifyLogin);
    expect(spotifyAuthenticateSignUpSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(spotifyAuthenticateSignUpSpy.access);
    expect(historyWithSignUpSpotifyLogin.location.pathname).toBe('/');
  });

  test('should login into spotify if redirect is received from any page', async () => {
    const { setCurrentAccountMock, spotifyAuthenticateLoginSpy } = makeSut(historyWithSpotifyLogin);
    expect(spotifyAuthenticateLoginSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(spotifyAuthenticateLoginSpy.access);
  });

  test('should show toast error if spotify fails', async () => {
    const { setCurrentAccountMock } = makeSut(historyWithSpotifyLogin, new Error());
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
    const { setCurrentAccountMock, spotifyAuthenticateLoginSpy } = makeSut(historyEmpty);
    expect(spotifyAuthenticateLoginSpy.callsCount).toBe(0);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledTimes(0);
  });

  test('should show toast invalid credentials error', async () => {
    const { setCurrentAccountMock } = makeSut(historyWithSpotifyLogin, new InvalidCredentialsError());
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledTimes(0);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Login Error',
      description: 'Your credentials are invalid.',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });
});
