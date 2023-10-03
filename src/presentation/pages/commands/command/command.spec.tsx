import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import Command from './command';
import { AccountModel } from '@/domain/models';
import { SaveCommandSpy, LoadCommandByIdSpy } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import userEvent from '@testing-library/user-event';

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
});
