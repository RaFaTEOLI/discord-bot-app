import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { MemoryHistory, createMemoryHistory } from 'history';
import { describe, expect, vi } from 'vitest';
import Commands from './commands';
import { screen, waitFor } from '@testing-library/react';
import { LoadDiscordCommandsSpy } from '@/domain/mocks';
import { faker } from '@faker-js/faker';

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
});
