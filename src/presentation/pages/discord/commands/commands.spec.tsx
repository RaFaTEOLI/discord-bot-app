import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { MemoryHistory, createMemoryHistory } from 'history';
import { describe, expect, vi } from 'vitest';
import Commands from './commands';
import { screen, waitFor } from '@testing-library/react';
import { LoadDiscordCommandsSpy } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import userEvent from '@testing-library/user-event';
import { UnexpectedError } from '@/domain/errors';

type SutTypes = {
  loadDiscordCommandsSpy: LoadDiscordCommandsSpy;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const history = createMemoryHistory({ initialEntries: ['/discord/commands'] });
const makeSut = (loadDiscordCommandsSpy = new LoadDiscordCommandsSpy()): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Commands({ loadDiscordCommands: loadDiscordCommandsSpy })
  });
  return {
    history,
    setCurrentAccountMock,
    loadDiscordCommandsSpy
  };
};

describe('Discord Commands', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should render the commands page', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Commands'
    });
    expect(pageContent).toBeTruthy();
  });

  test('should call loadDiscordCommands', async () => {
    const { loadDiscordCommandsSpy } = makeSut();
    await waitFor(() => expect(loadDiscordCommandsSpy.callsCount).toBe(1));
  });

  test('should display the discord commands', async () => {
    const { loadDiscordCommandsSpy } = makeSut();
    await waitFor(() => {
      expect(loadDiscordCommandsSpy.callsCount).toBe(1);
      expect(screen.getByTestId('commands-list').children).toHaveLength(loadDiscordCommandsSpy.commands.length);
    });
  });

  test('should display loading and then not display once page is loaded', async () => {
    makeSut();
    expect(screen.getByTestId('loading')).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeFalsy();
    });
  });

  test('should display error and reload button', async () => {
    const loadDiscordCommandsSpy = new LoadDiscordCommandsSpy();
    const errorMessage = faker.lorem.words();
    vi.spyOn(loadDiscordCommandsSpy, 'all').mockRejectedValueOnce(new Error(errorMessage));
    makeSut(loadDiscordCommandsSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('commands-list')).not.toBeTruthy();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap.textContent).toBe(`${errorMessage}Try again`);
  });

  test('should have only one command filtered from CommandList by command name', async () => {
    const { loadDiscordCommandsSpy } = makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    const inputFilter = screen.getByTestId('filter-command-input');
    await userEvent.type(inputFilter, loadDiscordCommandsSpy.commands[1].name);
    await waitFor(() => {
      expect(commandsList.children).toHaveLength(1);
      expect(commandsList.querySelector('.command-name')?.textContent).toBe(`${loadDiscordCommandsSpy.commands[1].name}`);
      expect(commandsList.querySelector('.command-description')?.textContent).toBe(
        loadDiscordCommandsSpy.commands[1].description
      );
    });
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

  test('should call LoadDiscordCommands on reload', async () => {
    const loadDiscordCommandsSpy = new LoadDiscordCommandsSpy();
    vi.spyOn(loadDiscordCommandsSpy, 'all').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadDiscordCommandsSpy);
    await waitFor(() => screen.getByTestId('error'));
    await userEvent.click(screen.getByTestId('reload'));
    await waitFor(() => screen.getByTestId('commands-list'));
    expect(loadDiscordCommandsSpy.callsCount).toBe(2);
  });

  test('should only one command filtered from CommandList by command description', async () => {
    const { loadDiscordCommandsSpy } = makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    const inputFilter = screen.getByTestId('filter-command-input');
    await userEvent.type(inputFilter, loadDiscordCommandsSpy.commands[2].description);
    expect(commandsList.children).toHaveLength(1);
    expect(commandsList.querySelector('.command-name')?.textContent).toBe(loadDiscordCommandsSpy.commands[2].name);
    expect(commandsList.querySelector('.command-description')?.textContent).toBe(
      loadDiscordCommandsSpy.commands[2].description
    );
  });
});
