import { Helper, renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { setTimeout } from 'timers/promises';
import userEvent from '@testing-library/user-event';
import Commands from './commands';
import { AccountModel } from '@/domain/models';
import { LoadCommandsSpy } from '@/domain/mocks';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';

const simulateInvalidSubmit = async (): Promise<void> => {
  const submitButton = screen.getByTestId('submit');
  await userEvent.click(submitButton);
};

type SutTypes = {
  loadCommandsSpy: LoadCommandsSpy;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const history = createMemoryHistory({ initialEntries: ['/commands'] });
const makeSut = (loadCommandsSpy = new LoadCommandsSpy()): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Commands({ loadCommands: loadCommandsSpy })
  });
  return {
    loadCommandsSpy,
    history,
    setCurrentAccountMock
  };
};

describe('Commands Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have commands page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Commands'
    });
    expect(pageContent).toBeInTheDocument();
  });

  test('should render Commands on success', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    expect(commandsList.children).toHaveLength(3);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('should render CommandModal on command view click', async () => {
    const { loadCommandsSpy } = makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    userEvent.click(commandsList.querySelector('.command-view-button') as Element);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    Helper.testValueForField('command', loadCommandsSpy.commands[0].command);
    Helper.testValueForField('description', loadCommandsSpy.commands[0].description);
    Helper.testValueForField('type', loadCommandsSpy.commands[0].type);
    Helper.testValueForField('dispatcher', loadCommandsSpy.commands[0].dispatcher);
  });

  test('should show form errors', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    userEvent.click(screen.getByTestId('new-command'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await simulateInvalidSubmit();
    await setTimeout(1000);
    Helper.testStatusForField('command', 'Required field');
    Helper.testStatusForField('description', 'Required field');
    Helper.testStatusForField('type', 'Required field');
    Helper.testStatusForField('dispatcher', 'Required field');
  });

  test('should call LoadCommands', async () => {
    const { loadCommandsSpy } = makeSut();
    await waitFor(() => screen.getByTestId('commands-list'));
    expect(loadCommandsSpy.callsCount).toBe(1);
  });

  test('should render error on UnexpectedError', async () => {
    const loadCommandsSpy = new LoadCommandsSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadCommandsSpy, 'all').mockRejectedValueOnce(error);
    makeSut(loadCommandsSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('commands-list')).not.toBeInTheDocument();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap).toHaveTextContent(error.message);
  });

  test('should render error on AccessDeniedError', async () => {
    const loadCommandsSpy = new LoadCommandsSpy();
    jest.spyOn(loadCommandsSpy, 'all').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut(loadCommandsSpy);
    await waitFor(() => screen.getByRole('heading'));
    await setTimeout(500);
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(history.location.pathname).toBe('/login');
  });

  test('should call LoadSurveyList on reload', async () => {
    const loadCommandsSpy = new LoadCommandsSpy();
    jest.spyOn(loadCommandsSpy, 'all').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadCommandsSpy);
    await waitFor(() => screen.getByTestId('error'));
    await userEvent.click(screen.getByTestId('reload'));
    await waitFor(() => screen.getByTestId('commands-list'));
    expect(loadCommandsSpy.callsCount).toBe(2);
  });

  test('should close CommandModal on close', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    userEvent.click(commandsList.querySelector('.command-view-button') as Element);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('close-modal'));
    await setTimeout(500);
    expect(commandForm).not.toBeInTheDocument();
  });
});
