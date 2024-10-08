import { createMemoryHistory } from 'history';
import { faker } from '@faker-js/faker';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { Login } from '@/presentation/pages';
import { Helper, renderWithHistory } from '@/presentation/mocks';
import { InvalidCredentialsError } from '@/domain/errors';
import { AuthenticationSpy, SpotifyAuthorizeSpy } from '@/domain/mocks';
import { Authentication } from '@/domain/usecases';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

type SutTypes = {
  authenticationSpy: AuthenticationSpy;
  setCurrentAccountMock: (account: Authentication.Model) => void;
  spotifyAuthorizeSpy: SpotifyAuthorizeSpy;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });
const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const spotifyAuthorizeSpy = new SpotifyAuthorizeSpy();
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () =>
      Login({
        authentication: authenticationSpy,
        spotifyAuthorize: spotifyAuthorizeSpy
      })
  });
  return { authenticationSpy, setCurrentAccountMock, spotifyAuthorizeSpy };
};

const simulateValidSubmit = async (email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await Helper.asyncPopulateField('email', email);
  await Helper.asyncPopulateField('password', password);
  const submitButton = await waitFor(() => screen.getByTestId('submit'));
  await userEvent.click(submitButton);
};

const simulateInvalidSubmit = async (): Promise<void> => {
  await userEvent.click(screen.getByTestId('email'));
  await userEvent.click(screen.getByTestId('password'));
  const submitButton = screen.getByTestId('submit');
  await userEvent.click(submitButton);
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should not render spinner and error on start', () => {
    makeSut();
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0);
  });

  test('should show email error and password error if validation fails', async () => {
    makeSut();
    await simulateInvalidSubmit();
    await waitFor(() => {
      Helper.testStatusForField('email', 'Required field');
      Helper.testStatusForField('password', 'Required field');
    });
  });

  test('should show valid email state if validation succeeds', async () => {
    makeSut();
    await waitFor(() => {
      Helper.populateField('email');
      Helper.testStatusForField('email');
    });
  });

  test('should show valid password state if validation succeeds', async () => {
    makeSut();
    await waitFor(() => {
      Helper.populateField('password');
      Helper.testStatusForField('password');
    });
  });

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut();

    const email = faker.internet.email();
    const password = faker.internet.password();
    await simulateValidSubmit(email, password);

    expect(authenticationSpy.params).toEqual({
      email,
      password
    });
  });

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut();
    await simulateValidSubmit();
    await simulateValidSubmit();
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('should not call Authentication if form is invalid', async () => {
    const { authenticationSpy } = makeSut();
    await simulateInvalidSubmit();
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    vi.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);
    await simulateValidSubmit();
    expect(screen.getByTestId('main-error').textContent).toBe(error.message);
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
  });

  test('should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut();
    await simulateValidSubmit();
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account);
    expect(history.location.pathname).toBe('/');
  });

  test('should redirect user to spotify authorize login url on spotify login', async () => {
    const { spotifyAuthorizeSpy } = makeSut();
    const spotifyButton = screen.getByTestId('spotify-button');
    await userEvent.click(spotifyButton);
    expect(spotifyAuthorizeSpy.callsCount).toBe(1);
  });

  test('should go to signup page', () => {
    makeSut();
    const register = screen.getByTestId('signup-link');
    fireEvent.click(register);
    expect(history.location.pathname).toBe('/signup');
  });
});
