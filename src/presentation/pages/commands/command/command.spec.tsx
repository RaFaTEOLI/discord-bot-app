import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import Command from './command';
import { AccountModel } from '@/domain/models';
import { SaveCommandSpy, LoadCommandByIdSpy } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import userEvent from '@testing-library/user-event';
import { AccessDeniedError, AccessTokenExpiredError } from '@/domain/errors';

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

const history = createMemoryHistory({ initialEntries: ['/commands/1'] });
const makeSut = (
  commandId = faker.datatype.uuid(),
  loadCommandByIdSpy = new LoadCommandByIdSpy(),
  saveCommandSpy = new SaveCommandSpy(),
  adminUser = false
): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    adminUser,
    Page: () =>
      Command({
        commandId,
        loadCommandById: loadCommandByIdSpy,
        saveCommand: saveCommandSpy
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
    expect(optionsList.children).toHaveLength(1);
  });

  test('should remove Command Option on option remove', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    expect(optionsList.children).toHaveLength(1);
    await userEvent.click(screen.getByTestId('0-option-remove'));
    expect(optionsList.children).toHaveLength(0);
  });

  test('should move down Command Option on option move down', async () => {
    makeSut();
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
    makeSut();
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
    const choicesList = await screen.findByTestId('choices-list');
    expect(choicesList.children).toHaveLength(1);
  });

  test('should remove Command Choice on choice remove', async () => {
    makeSut();
    await waitFor(() => screen.getByTestId('command-content'));
    await userEvent.click(screen.getByTestId('add-option'));
    const optionsList = await screen.findByTestId('options-list');
    await waitFor(() => optionsList);
    await userEvent.click(screen.getByTestId('0-choice-add'));
    const choicesList = await screen.findByTestId('choices-list');
    expect(choicesList.children).toHaveLength(1);
    await userEvent.click(screen.getByTestId('0-choice-0-remove'));
    expect(choicesList.children).toHaveLength(0);
  });

  test('should call toast with error if LoadCommandById fails', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new Error());
    makeSut(faker.datatype.uuid(), loadCommandByIdSpy);
    await waitFor(() => screen.getByTestId('command-content'));
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Server Error',
      description: 'There was an error while trying to load your command',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top'
    });
  });

  test('should show error toast on AccessDeniedError on LoadCommandById and send it to login', async () => {
    const loadCommandByIdSpy = new LoadCommandByIdSpy();
    jest.spyOn(loadCommandByIdSpy, 'loadById').mockRejectedValueOnce(new AccessDeniedError());
    const { setCurrentAccountMock, history } = makeSut(faker.datatype.uuid(), loadCommandByIdSpy);
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
    const { setCurrentAccountMock, history } = makeSut(faker.datatype.uuid(), loadCommandByIdSpy);
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
});
