import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { MemoryHistory, createMemoryHistory } from 'history';
import { describe, expect, vi } from 'vitest';
import Commands from './commands';
import { screen, waitFor } from '@testing-library/react';
import { LoadDiscordCommandsSpy } from '@/domain/mocks';

type SutTypes = {
  loadDiscordCommandsSpy: LoadDiscordCommandsSpy;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const history = createMemoryHistory({ initialEntries: ['/discord/commands'] });
const makeSut = (): SutTypes => {
  const loadDiscordCommandsSpy = new LoadDiscordCommandsSpy();
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
      expect(screen.getByTestId('discord-commands').querySelectorAll('.command').length).toBe(
        loadDiscordCommandsSpy.commands.length
      );
    });
  });

  test('should display loading and then not display once page is loaded', async () => {
    makeSut();
    expect(screen.getByTestId('loading')).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeFalsy();
    });
  });
});
