import { fireEvent, waitFor, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { SignUp } from '@/presentation/pages';
import { Helper, renderWithHistory } from '@/presentation/mocks';
import { EmailAlreadyBeingUsedError } from '@/domain/errors';
import { createMemoryHistory } from 'history';
import { AddAccountSpy, SpotifyAuthorizeSpy } from '@/domain/mocks';
import { AddAccount } from '@/domain/usecases';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

type SutTypes = {
  addAccountSpy: AddAccountSpy;
  setCurrentAccountMock: (account: AddAccount.Model) => void;
  spotifyAuthorizeSpy: SpotifyAuthorizeSpy;
};

const history = createMemoryHistory({ initialEntries: ['/signup'] });
const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const spotifyAuthorizeSpy = new SpotifyAuthorizeSpy();
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => SignUp({ addAccount: addAccountSpy, spotifyAuthorize: spotifyAuthorizeSpy })
  });
  return { addAccountSpy, setCurrentAccountMock, spotifyAuthorizeSpy };
};

const simulateValidSubmit = async (
  name = faker.random.word(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  await Helper.asyncPopulateField('name', name);
  await Helper.asyncPopulateField('email', email);
  await Helper.asyncPopulateField('password', password);
  await Helper.asyncPopulateField('passwordConfirmation', password);
  const submitButton = await waitFor(() => screen.getByTestId('submit'));
  await userEvent.click(submitButton);
};

const simulateInvalidSubmit = async (): Promise<void> => {
  await userEvent.click(screen.getByTestId('name'));
  await userEvent.click(screen.getByTestId('email'));
  await userEvent.click(screen.getByTestId('password'));
  await userEvent.click(screen.getByTestId('passwordConfirmation'));
  const submitButton = screen.getByTestId('submit');
  await userEvent.click(submitButton);
};

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should start with initial state', () => {
    makeSut();
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0);
  });

  test('should show form error if validation fails', async () => {
    makeSut();
    await simulateInvalidSubmit();
    await waitFor(() => {
      Helper.testStatusForField('name', 'Required field');
      Helper.testStatusForField('email', 'Required field');
      Helper.testStatusForField('password', 'Required field');
      Helper.testStatusForField('passwordConfirmation', 'Required field');
    });
  });

  test('should show valid name state if validation succeeds', async () => {
    makeSut();
    await waitFor(() => {
      Helper.populateField('name');
      Helper.testStatusForField('name');
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

  test('should show valid passwordConfirmation state if validation succeeds', async () => {
    makeSut();
    await waitFor(() => {
      Helper.populateField('passwordConfirmation');
      Helper.testStatusForField('passwordConfirmation');
    });
  });

  test('should call AddAccount with correct value', async () => {
    const { addAccountSpy } = makeSut();
    const name = faker.random.word();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(name, email, password);
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    });
  });

  test('should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut();
    await simulateValidSubmit();
    await simulateValidSubmit();
    expect(addAccountSpy.callsCount).toBe(1);
  });

  test('should not call AddAccount if form is invalid', async () => {
    const { addAccountSpy } = makeSut();
    await simulateInvalidSubmit();
    expect(addAccountSpy.callsCount).toBe(0);
  });

  test('should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut();
    const error = new EmailAlreadyBeingUsedError();
    vi.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);
    await simulateValidSubmit();
    expect(screen.getByTestId('main-error').textContent).toBe(error.message);
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
  });

  test('should call UpdateCurrentAccount on success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut();
    await simulateValidSubmit();
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
    expect(history.location.pathname).toBe('/');
  });

  test('should redirect user to spotify authorize signup url on spotify signup', async () => {
    const { spotifyAuthorizeSpy } = makeSut();
    const spotifyButton = screen.getByTestId('spotify-button');
    await userEvent.click(spotifyButton);
    expect(spotifyAuthorizeSpy.callsCount).toBe(1);
  });

  test('should go to login page', () => {
    makeSut();
    const loginLink = screen.getByTestId('login-link');
    fireEvent.click(loginLink);
    expect(history.location.pathname).toBe('/login');
  });
});
