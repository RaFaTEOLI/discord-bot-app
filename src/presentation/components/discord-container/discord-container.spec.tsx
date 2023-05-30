/* eslint-disable no-global-assign */
import { renderWithHistory } from '@/presentation/mocks';
import { createMemoryHistory, MemoryHistory } from 'history';
import DiscordContainer from './discord-container';
import { Authentication } from '@/domain/usecases';
import { setTimeout } from 'timers/promises';
import { InvalidCredentialsError } from '@/domain/errors';
import { DiscordAuthenticateSpy, DiscordLoadUserSpy, SaveUserSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';

type SutTypes = {
  setCurrentAccountMock: (account: Authentication.Model) => void;
  discordAuthenticateSpy: DiscordAuthenticateSpy;
  discordLoadUserSpy: DiscordLoadUserSpy;
  getCurrentAccountMock: () => AccountModel;
  saveUserSpy: SaveUserSpy;
};

const historyEmpty = createMemoryHistory({ initialEntries: ['/discord'] });
const historyWithDiscordLogin = createMemoryHistory({ initialEntries: ['/discord?code=any_code'] });

const makeSut = (memoryHistory: MemoryHistory = historyWithDiscordLogin, error: null | Error = null): SutTypes => {
  const discordAuthenticateSpy = new DiscordAuthenticateSpy();
  const discordLoadUserSpy = new DiscordLoadUserSpy();
  const saveUserSpy = new SaveUserSpy();
  if (error) {
    console.log('Throwing error');
    jest.spyOn(discordAuthenticateSpy, 'request').mockRejectedValue(error);
    jest.spyOn(discordLoadUserSpy, 'load').mockRejectedValue(error);
    jest.spyOn(saveUserSpy, 'save').mockRejectedValue(error);
  }
  const { setCurrentAccountMock, getCurrentAccountMock } = renderWithHistory({
    history: memoryHistory,
    Page: () =>
      DiscordContainer({
        discordAuthenticate: discordAuthenticateSpy,
        discordLoadUser: discordLoadUserSpy,
        saveUser: saveUserSpy
      })
  });
  return { setCurrentAccountMock, discordAuthenticateSpy, discordLoadUserSpy, getCurrentAccountMock, saveUserSpy };
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
jest.setTimeout(8000);

describe('Discord Container Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should call DiscordLoadUser with Discord Access Token', async () => {
    const { discordAuthenticateSpy, discordLoadUserSpy } = makeSut();
    const loadUserSpy = jest.spyOn(discordLoadUserSpy, 'load');
    expect(discordAuthenticateSpy.callsCount).toBe(1);
    await setTimeout(3000);
    expect(loadUserSpy).toHaveBeenCalledWith(discordAuthenticateSpy.access.access_token);
  });

  test('should load user from Discord and then save it', async () => {
    const { setCurrentAccountMock, discordLoadUserSpy, getCurrentAccountMock, saveUserSpy } = makeSut();
    const saveSpy = jest.spyOn(saveUserSpy, 'save');
    await setTimeout(3000);
    const currentAccount = getCurrentAccountMock();
    currentAccount.user.discord = {
      id: discordLoadUserSpy.access.user.id,
      username: discordLoadUserSpy.access.user.username,
      avatar: discordLoadUserSpy.access.user.avatar,
      discriminator: discordLoadUserSpy.access.user.discriminator
    };
    expect(setCurrentAccountMock).toHaveBeenCalledWith(currentAccount);
    expect(saveUserSpy.callsCount).toBe(1);
    expect(saveSpy).toHaveBeenLastCalledWith({ discord: currentAccount.user.discord });
    expect(historyWithDiscordLogin.location.pathname).toBe('/');
  });

  test('should show toast error if discord fails', async () => {
    const { setCurrentAccountMock } = makeSut(historyWithDiscordLogin, new Error());
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledTimes(0);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Login Error',
      description: 'There was an error while trying to login with Discord.',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should not login into discord if no redirect is received from any page', async () => {
    const { setCurrentAccountMock, discordAuthenticateSpy } = makeSut(historyEmpty);
    expect(discordAuthenticateSpy.callsCount).toBe(0);
    await setTimeout(3000);
    expect(setCurrentAccountMock).toHaveBeenCalledTimes(0);
  });

  test('should show toast invalid credentials error', async () => {
    const { setCurrentAccountMock } = makeSut(historyWithDiscordLogin, new InvalidCredentialsError());
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
