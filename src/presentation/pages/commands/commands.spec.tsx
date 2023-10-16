import { Helper, renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { setTimeout } from 'timers/promises';
import userEvent from '@testing-library/user-event';
import Commands from './commands';
import { AccountModel } from '@/domain/models';
import { RunCommandSpy, DeleteCommandSpy, LoadCommandsSpy } from '@/domain/mocks';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    __esModule: true,
    ...originalModule,
    useToast: jest.fn().mockImplementation(() => mockToast)
  };
});

type SutTypes = {
  loadCommandsSpy: LoadCommandsSpy;
  deleteCommandSpy: DeleteCommandSpy;
  runCommandSpy: RunCommandSpy;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const history = createMemoryHistory({ initialEntries: ['/commands'] });
const makeSut = (
  loadCommandsSpy = new LoadCommandsSpy(),
  deleteCommandSpy = new DeleteCommandSpy(),
  runCommandSpy = new RunCommandSpy(),
  adminUser = false
): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    adminUser,
    Page: () =>
      Commands({
        loadCommands: loadCommandsSpy,
        deleteCommand: deleteCommandSpy,
        runCommand: runCommandSpy
      })
  });
  return {
    loadCommandsSpy,
    deleteCommandSpy,
    runCommandSpy,
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
    await userEvent.click(commandsList.querySelector('.command-view-button') as Element);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    Helper.testValueForField('command', loadCommandsSpy.commands[0].command);
    Helper.testValueForField('description', loadCommandsSpy.commands[0].description);
    Helper.testValueForField('type', loadCommandsSpy.commands[0].type);
    Helper.testValueForField('dispatcher', loadCommandsSpy.commands[0].dispatcher);
  });

  test('should call LoadCommands', async () => {
    const { loadCommandsSpy } = makeSut();
    await waitFor(() => screen.getByTestId('commands-list'));
    expect(loadCommandsSpy.callsCount).toBe(1);
  });

  test('should render error on UnexpectedError on LoadCommands', async () => {
    const loadCommandsSpy = new LoadCommandsSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadCommandsSpy, 'all').mockRejectedValueOnce(error);
    makeSut(loadCommandsSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('commands-list')).not.toBeInTheDocument();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap).toHaveTextContent(error.message);
  });

  test('should render error on AccessDeniedError on LoadCommands', async () => {
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

  test('should have only one command filtered from CommandList by command name', async () => {
    const { loadCommandsSpy } = makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    const inputFilter = screen.getByTestId('filter-command-input');
    await userEvent.type(inputFilter, loadCommandsSpy.commands[1].command);
    expect(commandsList.children).toHaveLength(1);
    expect(commandsList.querySelector('.command-name')).toHaveTextContent(`!${loadCommandsSpy.commands[1].command}`);
    expect(commandsList.querySelector('.command-description')).toHaveTextContent(loadCommandsSpy.commands[1].description);
  });

  test('should show all commands from CommandList if empty filter is provided', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    const inputFilter = screen.getByTestId('filter-command-input');
    await userEvent.type(inputFilter, ' ');
    expect(commandsList.children).toHaveLength(3);
  });

  test('should show zero commands from CommandList if filter does not match with any command', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    const inputFilter = screen.getByTestId('filter-command-input');
    await userEvent.type(inputFilter, 'INVALID FILTER');
    expect(commandsList.children).toHaveLength(0);
  });

  test('should only one command filtered from CommandList by command description', async () => {
    const { loadCommandsSpy } = makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    const inputFilter = screen.getByTestId('filter-command-input');
    await userEvent.type(inputFilter, loadCommandsSpy.commands[2].description);
    expect(commandsList.children).toHaveLength(1);
    expect(commandsList.querySelector('.command-name')).toHaveTextContent(`!${loadCommandsSpy.commands[2].command}`);
    expect(commandsList.querySelector('.command-description')).toHaveTextContent(loadCommandsSpy.commands[2].description);
  });

  test('should call DeleteCommand with correct values', async () => {
    const { deleteCommandSpy, loadCommandsSpy } = makeSut(
      new LoadCommandsSpy(),
      new DeleteCommandSpy(),
      new RunCommandSpy(),
      true
    );
    const deleteSpy = jest.spyOn(deleteCommandSpy, 'delete');
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    await userEvent.click(commandsList.querySelectorAll('.command-view-button')[1]);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    await userEvent.click(screen.getByTestId('delete-button'));
    const confirmButton = await screen.findByTestId('confirmation-confirm-button');
    await waitFor(() => confirmButton);
    await userEvent.click(confirmButton);
    await setTimeout(500);
    expect(deleteCommandSpy.callsCount).toBe(1);
    expect(deleteSpy).toHaveBeenCalledWith(loadCommandsSpy.commands[1].id);
    expect(commandForm).not.toBeInTheDocument();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Deleted Command',
      description: 'Your command was successfully deleted',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should render error on UnexpectedError on DeleteCommand', async () => {
    const deleteCommandSpy = new DeleteCommandSpy();
    const error = new UnexpectedError();
    jest.spyOn(deleteCommandSpy, 'delete').mockRejectedValueOnce(error);
    makeSut(new LoadCommandsSpy(), deleteCommandSpy, new RunCommandSpy(), true);
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    await userEvent.click(commandsList.querySelectorAll('.command-view-button')[1]);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    await userEvent.click(screen.getByTestId('delete-button'));
    const confirmButton = await screen.findByTestId('confirmation-confirm-button');
    await waitFor(() => confirmButton);
    await userEvent.click(confirmButton);
    await setTimeout(1000);
    expect(commandForm).not.toBeInTheDocument();
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('commands-list')).not.toBeInTheDocument();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap).toHaveTextContent(error.message);
  });

  test('should call RunCommand with correct values', async () => {
    const { runCommandSpy, loadCommandsSpy } = makeSut(
      new LoadCommandsSpy(),
      new DeleteCommandSpy(),
      new RunCommandSpy(),
      true
    );
    const runSpy = jest.spyOn(runCommandSpy, 'run');
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    await userEvent.click(commandsList.querySelectorAll('.command-run-button')[1]);
    await setTimeout(500);
    expect(runCommandSpy.callsCount).toBe(1);
    expect(runSpy).toHaveBeenCalledWith(loadCommandsSpy.commands[1].command);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Run Command',
      description: 'Your command was successfully run',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should call toast with error values if RunCommand fails', async () => {
    const runCommandSpy = new RunCommandSpy();
    jest.spyOn(runCommandSpy, 'run').mockRejectedValueOnce(new Error());
    makeSut(new LoadCommandsSpy(), new DeleteCommandSpy(), runCommandSpy, true);
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    await userEvent.click(commandsList.querySelectorAll('.command-run-button')[1]);
    await setTimeout(1000);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Run Command',
      description: 'There was an error while trying to run your command!',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
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

  test('should navigate to Command page on edit', async () => {
    const loadCommandsSpy = new LoadCommandsSpy();
    const { history } = makeSut(loadCommandsSpy, new DeleteCommandSpy(), new RunCommandSpy(), true);
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    await userEvent.click(commandsList.querySelectorAll('.command-view-button')[1]);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    await setTimeout(500);
    expect(commandForm).toBeInTheDocument();
    userEvent.click(screen.getByTestId('custom-button'));
    expect(history.location.pathname).toBe(`/commands/${loadCommandsSpy.commands[1].id}`);
  });

  test('should navigate to Command page on edit', async () => {
    const { history } = makeSut(new LoadCommandsSpy(), new DeleteCommandSpy(), new RunCommandSpy(), true);
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    await userEvent.click(screen.getByTestId('new-command'));
    expect(history.location.pathname).toBe('/commands/new');
  });
});
