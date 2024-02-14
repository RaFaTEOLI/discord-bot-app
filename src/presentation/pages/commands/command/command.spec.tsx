import { Helper, renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import Command from './command';
import { AccountModel, CommandDiscordStatus, CommandModel } from '@/domain/models';
import {
  SaveCommandSpy,
  LoadCommandByIdSpy,
  mockCommandModel,
  mockSaveCommandParams,
  io as mockIo,
  serverSocket
} from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import userEvent from '@testing-library/user-event';
import { AccessDeniedError, AccessTokenExpiredError, CommandAlreadyCreatedError, UnexpectedError } from '@/domain/errors';
import { commandState, types, dispatchers, applicationCommandTypes, commandOptionTypes } from './components';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { Socket } from 'socket.io-client';

const mockToast = vi.fn();
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...(actual as any),
    useToast: vi.fn().mockImplementation(() => mockToast)
  };
});

type SutTypes = {
  commandId: string;
  loadCommandByIdSpy: LoadCommandByIdSpy;
  saveCommandSpy: SaveCommandSpy;
  socketClientSpy: Socket;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const simulateInvalidSubmit = async (): Promise<void> => {
  const submitButton = screen.getByTestId('submit');
  await userEvent.click(submitButton);
};

type Override = {
  commandId?: string;
  loadCommandByIdSpy?: LoadCommandByIdSpy;
  saveCommandSpy?: SaveCommandSpy;
  socketClientSpy?: Socket;
  adminUser?: boolean;
  invalidForm?: boolean;
};

type FormValues = Omit<CommandModel, 'id'> & {
  discordType: string;
};

const simulateValidSubmit = async (): Promise<FormValues> => {
  const formValues = mockSaveCommandParams();
  const submitButton = screen.getByTestId('submit');
  await Helper.asyncPopulateField('command', formValues.command);
  await Helper.asyncPopulateField('description', formValues.description);
  await Helper.asyncPopulateField('dispatcher', formValues.dispatcher, true);
  await Helper.asyncPopulateField('type', formValues.type, true);
  await Helper.asyncPopulateField('response', formValues.response);
  await Helper.asyncPopulateField('discordType', formValues.discordType.toString(), true);
  await userEvent.click(submitButton);
  return formValues as FormValues;
};

const simulateValidSubmit2 = async (): Promise<FormValues> => {
  const formValues = mockSaveCommandParams();
  Helper.populateField('command', formValues.command);
  Helper.populateField('description', formValues.description);
  Helper.populateField('dispatcher', formValues.dispatcher, true);
  Helper.populateField('type', formValues.type, true);
  Helper.populateField('response', formValues.response);
  Helper.populateField('discordType', formValues.discordType.toString(), true);
  const submitButton = await waitFor(() => screen.getByTestId('submit'));
  await userEvent.click(submitButton);
  return formValues as FormValues;
};

const history = createMemoryHistory({ initialEntries: ['/commands/1'] });
const makeSut = (override?: Override): SutTypes => {
  const commandId = override?.commandId ?? faker.datatype.uuid();
  const loadCommandByIdSpy = override?.loadCommandByIdSpy ?? new LoadCommandByIdSpy();
  const saveCommandSpy = override?.saveCommandSpy ?? new SaveCommandSpy();
  const socketClientSpy = override?.socketClientSpy ?? (mockIo.connect() as unknown as Socket);
  const invalidForm = override?.invalidForm ?? false;

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    adminUser: override?.adminUser ?? false,
    Page: () =>
      Command({
        commandId,
        loadCommandById: loadCommandByIdSpy,
        saveCommand: saveCommandSpy,
        socketClient: socketClientSpy
      }),
    ...(invalidForm && {
      states: [
        {
          atom: commandState,
          value: {
            reload: false,
            isLoading: false,
            command: {
              id: null,
              command: null,
              description: null,
              type: null,
              dispatcher: null,
              response: null,
              discordType: null,
              discordStatus: null
            },
            types,
            dispatchers,
            applicationCommandTypes,
            commandOptionTypes,
            disabledForm: false,
            errors: {
              command: {
                message: 'command must be at least 2 characters'
              },
              description: {
                message: 'description must be at least 2 characters'
              },
              type: {
                message: 'Required field'
              },
              dispatcher: {
                message: 'Required field'
              },
              discordType: {
                message: 'Required field'
              }
            }
          }
        }
      ]
    })
  });
  return {
    commandId,
    loadCommandByIdSpy,
    saveCommandSpy,
    socketClientSpy,
    history,
    setCurrentAccountMock
  };
};

describe('Command Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  test('should have command page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Command'
    });
    expect(pageContent).toBeTruthy();
  });

  test('should call LoadCommandById', async () => {
    const { loadCommandByIdSpy, commandId } = makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    expect(loadCommandByIdSpy.callsCount).toBe(1);
    expect(loadCommandByIdSpy.commandId).toBe(commandId);
  });

  test('should add Command Option on option add', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    expect(optionsList.children).toHaveLength(2);
  });

  test('should remove Command Option on option remove', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    expect(optionsList.children).toHaveLength(2);
    await userEvent.click(screen.getByTestId('0-option-remove'));
    expect(optionsList.children).toHaveLength(1);
  });

  test('should move down Command Option on option move down', async () => {
    const { options, ...commandModel } = mockCommandModel(faker.helpers.arrayElement(['music', 'message']));
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    await userEvent.type(screen.getByTestId('options.0.name'), 'test');
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('0-option-move-down'));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const optionNameInput = screen.getByTestId('options.1.name') as HTMLInputElement;
    expect(optionNameInput.value).toBe('test');
  });

  test('should move up Command Option on option move up', async () => {
    const { options, ...commandModel } = mockCommandModel(faker.helpers.arrayElement(['music', 'message']));
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    await userEvent.click(screen.getByTestId('add-option'));
    await userEvent.type(screen.getByTestId('options.1.name'), 'test');
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('1-option-move-up'));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const optionNameInput = screen.getByTestId('options.0.name') as HTMLInputElement;
    expect(optionNameInput.value).toBe('test');
  });

  test('should add Command Choice on choice add', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('0-choice-add'));
    const choicesList = await screen.findByTestId('0-choices-list');
    expect(choicesList.children).toHaveLength(1);
  });

  test('should remove Command Choice on choice remove', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('0-choice-add'));
    const choicesList = await screen.findByTestId('0-choices-list');
    expect(choicesList.children).toHaveLength(1);
    await userEvent.click(screen.getByTestId('0-choice-0-remove'));
    expect(choicesList.children).toHaveLength(0);
  });

  test('should move up Command Choice on option move down', async () => {
    const { options, ...commandModel } = mockCommandModel(faker.helpers.arrayElement(['music', 'message']));
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('0-choice-add'));
    await userEvent.click(screen.getByTestId('0-choice-add'));
    await userEvent.type(screen.getByTestId('options[0].choices.0.name'), 'test');
    await userEvent.click(screen.getByTestId('0-choice-0-move-down'));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const optionNameInput = screen.getByTestId('options[0].choices.1.name') as HTMLInputElement;
    expect(optionNameInput.value).toBe('test');
  });

  test('should move up Command Choice on option move up', async () => {
    const { options, ...commandModel } = mockCommandModel(faker.helpers.arrayElement(['music', 'message']));
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('0-choice-add'));
    await userEvent.click(screen.getByTestId('0-choice-add'));
    await userEvent.type(screen.getByTestId('options[0].choices.1.name'), 'test');
    await userEvent.click(screen.getByTestId('0-choice-1-move-up'));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const optionNameInput = screen.getByTestId('options[0].choices.0.name') as HTMLInputElement;
    expect(optionNameInput.value).toBe('test');
  });

  test('should call toast with error if LoadCommandById fails', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new Error());
    makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Server Error',
      description: 'There was an error while trying to load your command',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should show error toast on AccessDeniedError on LoadCommandById and send it to login', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByRole('heading'));
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(history.location.pathname).toBe('/login');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Access Denied',
        description: 'Your login has expired, please log in again!',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    });
  });

  test('should show error toast on AccessTokenExpiredError on LoadCommandById and send it to login', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new AccessTokenExpiredError());
    const { setCurrentAccountMock, history } = makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByRole('heading'));
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(history.location.pathname).toBe('/login');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Access Denied',
        description: 'Your login has expired, please log in again!',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    });
  });

  test('should show form errors', async () => {
    makeSut({ commandId: 'new', invalidForm: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    await simulateInvalidSubmit();
    await waitFor(() => {
      Helper.testStatusForField('command', 'command must be at least 2 characters');
      Helper.testStatusForField('description', 'description must be at least 2 characters');
      Helper.testStatusForField('type', 'Required field');
      Helper.testStatusForField('dispatcher', 'Required field');
      Helper.testStatusForField('discordType', 'Required field');
    });
  });

  test('should not call LoadCommandById if it is a new', async () => {
    const { loadCommandByIdSpy } = makeSut({ commandId: 'new' });
    await waitFor(() => screen.getByTestId('command-content'));
    expect(loadCommandByIdSpy.callsCount).toBe(0);
  });

  test('should call SaveCommand on success from edit page', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    const commandModel = mockCommandModel('message');
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    const { saveCommandSpy } = makeSut({ adminUser: true, loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    const formValues = await simulateValidSubmit2();
    await waitFor(() => {
      expect(saveCommandSpy.params).toEqual(
        Object.assign({}, formValues, {
          id: commandModel.id,
          // eslint-disable-next-line
          // @ts-ignore
          options: [{ ...commandModel.options[0], type: commandModel.options[0].type, choices: [] }]
        })
      );
    });
  });

  test('should call SaveCommand on success from new page and navigate to commands', async () => {
    const { saveCommandSpy } = makeSut({ commandId: 'new', adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    const formValues = await simulateValidSubmit();
    await waitFor(() => {
      expect(saveCommandSpy.params).toEqual(formValues);
      expect(history.location.pathname).toBe('/commands');
    });
  });

  test('should render error on UnexpectedError on SaveCommand', async () => {
    const saveCommandSpy = new SaveCommandSpy();
    const error = new UnexpectedError();
    vi.spyOn(saveCommandSpy, 'save').mockRejectedValueOnce(error);
    makeSut({ saveCommandSpy, adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    await simulateValidSubmit();
    await waitFor(() => expect(screen.queryByTestId('loading')).toBeFalsy());
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Server Error',
        description: 'There was an error while trying to save your command',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    });
  });

  test('should show error toast on AccessDeniedError on SaveCommand and send it to login', async () => {
    const saveCommandSpy = new SaveCommandSpy();
    vi.spyOn(saveCommandSpy, 'save').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut({ saveCommandSpy, adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    await simulateValidSubmit();
    await waitFor(() => {
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
      expect(history.location.pathname).toBe('/login');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Access Denied',
        description: 'Your login has expired, please log in again!',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    });
  });

  test('should show DiscordStatusBadge', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    const commandModel = mockCommandModel('message');
    commandModel.discordStatus = CommandDiscordStatus.SENT;
    vi.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    makeSut();
    await waitFor(() => expect(screen.getByTestId('discord-status-badge')).toBeTruthy());
  });

  test('should refetch command on command status change', async () => {
    const commandId = faker.datatype.uuid();
    const socketClientSpy = mockIo.connect() as unknown as Socket;
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    makeSut({ commandId, socketClientSpy, loadCommandByIdSpy });
    expect(loadCommandByIdSpy.command.discordStatus).toBeFalsy();

    const commandModel = mockCommandModel('message');
    commandModel.id = commandId;
    commandModel.discordStatus = CommandDiscordStatus.SENT;

    serverSocket.emit('command', commandModel);

    await waitFor(() => {
      expect(loadCommandByIdSpy.callsCount).toBe(2);
    });
  });

  test('should not refetch command on command status change', async () => {
    const commandId = faker.datatype.uuid();
    const socketClientSpy = mockIo.connect() as unknown as Socket;
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    makeSut({ commandId, socketClientSpy, loadCommandByIdSpy });
    expect(loadCommandByIdSpy.command.discordStatus).toBeFalsy();

    const commandModel = mockCommandModel('message');

    serverSocket.emit('command', commandModel);

    await waitFor(() => {
      expect(loadCommandByIdSpy.callsCount).toBe(1);
    });
  });

  test('should show discordType description when selected', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    const { discordType } = mockSaveCommandParams();
    const selectedDiscordType = applicationCommandTypes.find(type => type.value === discordType.toString());
    await Helper.asyncPopulateField('discordType', discordType.toString(), true);
    await waitFor(() => {
      expect(screen.getByTestId('discordType-description')).toBeTruthy();
      expect(screen.getByTestId('discordType-description').textContent).toBe(selectedDiscordType?.description);
    });
  });

  test('should show warning toast on CommandAlreadyCreated on SaveCommand', async () => {
    const saveCommandSpy = new SaveCommandSpy();
    const column = faker.database.column();
    vi.spyOn(saveCommandSpy, 'save').mockRejectedValueOnce(new CommandAlreadyCreatedError(column));
    makeSut({ saveCommandSpy, adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeTruthy();
    await simulateValidSubmit();
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Ops!',
        description: 'There is already a command created with this name!',
        status: 'warning',
        duration: 9000,
        isClosable: true
      });
    });
  });
});
