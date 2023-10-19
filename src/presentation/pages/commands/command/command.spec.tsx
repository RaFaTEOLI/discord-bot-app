import { Helper, renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import Command from './command';
import { AccountModel, CommandModel } from '@/domain/models';
import { SaveCommandSpy, LoadCommandByIdSpy, mockCommandModel, mockSaveCommandParams } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import userEvent from '@testing-library/user-event';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { setTimeout } from 'timers/promises';
import { commandState, types, dispatchers, applicationCommandTypes, commandOptionTypes } from './components';

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
  commandId: string;
  loadCommandByIdSpy: LoadCommandByIdSpy;
  saveCommandSpy: SaveCommandSpy;
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
  const { discordType, ...restValues } = formValues;
  return { discordType: discordType.toString(), ...restValues } as FormValues;
};

const simulateValidSubmit2 = async (): Promise<FormValues> => {
  await setTimeout(1000);
  const formValues = mockSaveCommandParams();
  Helper.populateField('command', formValues.command);
  Helper.populateField('description', formValues.description);
  Helper.populateField('dispatcher', formValues.dispatcher, true);
  Helper.populateField('type', formValues.type, true);
  Helper.populateField('response', formValues.response);
  Helper.populateField('discordType', formValues.discordType.toString(), true);
  const submitButton = await waitFor(() => screen.getByTestId('submit'));
  await userEvent.click(submitButton);
  await setTimeout(500);
  const { discordType, ...restValues } = formValues;
  return { discordType: discordType.toString(), ...restValues } as FormValues;
};

const history = createMemoryHistory({ initialEntries: ['/commands/1'] });
const makeSut = (override?: Override): SutTypes => {
  const commandId = override?.commandId ?? faker.datatype.uuid();
  const loadCommandByIdSpy = override?.loadCommandByIdSpy ?? new LoadCommandByIdSpy();
  const saveCommandSpy = override?.saveCommandSpy ?? new SaveCommandSpy();
  const invalidForm = override?.invalidForm ?? false;

  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    adminUser: override?.adminUser ?? false,
    Page: () =>
      Command({
        commandId,
        loadCommandById: loadCommandByIdSpy,
        saveCommand: saveCommandSpy
      }),
    ...(invalidForm && {
      states: [
        {
          atom: commandState,
          value: {
            reload: false,
            isLoading: false,
            command: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' },
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
    history,
    setCurrentAccountMock
  };
};

describe('Command Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have command page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Command'
    });
    expect(pageContent).toBeInTheDocument();
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
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
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
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
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
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
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
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
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
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new Error());
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
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByRole('heading'));
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

  test('should show error toast on AccessTokenExpiredError on LoadCommandById and send it to login', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new AccessTokenExpiredError());
    const { setCurrentAccountMock, history } = makeSut({ loadCommandByIdSpy });
    await waitFor(() => screen.getByRole('heading'));
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

  test('should show form errors', async () => {
    makeSut({ commandId: 'new', invalidForm: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await simulateInvalidSubmit();
    await setTimeout(1500);
    Helper.testStatusForField('command', 'command must be at least 2 characters');
    Helper.testStatusForField('description', 'description must be at least 2 characters');
    Helper.testStatusForField('type', 'Required field');
    Helper.testStatusForField('dispatcher', 'Required field');
    Helper.testStatusForField('discordType', 'Required field');
  });

  test('should not call LoadCommandById if it is a new', async () => {
    const { loadCommandByIdSpy } = makeSut({ commandId: 'new' });
    await waitFor(() => screen.getByTestId('command-content'));
    expect(loadCommandByIdSpy.callsCount).toBe(0);
  });

  test('should call SaveCommand on success from edit page', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    const commandModel = mockCommandModel('message');
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockResolvedValueOnce(commandModel);
    const { saveCommandSpy } = makeSut({ adminUser: true, loadCommandByIdSpy });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    const formValues = await simulateValidSubmit2();
    expect(saveCommandSpy.params).toEqual(
      Object.assign({}, formValues, {
        id: commandModel.id,
        // eslint-disable-next-line
        // @ts-ignore
        options: [{ ...commandModel.options[0], type: commandModel.options[0].type.toString(), choices: [] }]
      })
    );
  });

  test('should call SaveCommand on success from new page and navigate to commands', async () => {
    const { saveCommandSpy } = makeSut({ commandId: 'new', adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    const formValues = await simulateValidSubmit();
    await setTimeout(500);
    expect(saveCommandSpy.params).toEqual(Object.assign({}, formValues, { options: [] }));
    expect(history.location.pathname).toBe('/commands');
  });

  test('should render error on UnexpectedError on SaveCommand', async () => {
    const saveCommandSpy = new SaveCommandSpy();
    const error = new UnexpectedError();
    jest.spyOn(saveCommandSpy, 'save').mockRejectedValueOnce(error);
    makeSut({ saveCommandSpy, adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await simulateValidSubmit();
    await setTimeout(500);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Server Error',
      description: 'There was an error while trying to save your command',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should show error toast on AccessDeniedError on SaveCommand and send it to login', async () => {
    const saveCommandSpy = new SaveCommandSpy();
    jest.spyOn(saveCommandSpy, 'save').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut({ saveCommandSpy, adminUser: true });
    await waitFor(() => screen.getByTestId('command-content'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await simulateValidSubmit();
    await setTimeout(1000);
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
