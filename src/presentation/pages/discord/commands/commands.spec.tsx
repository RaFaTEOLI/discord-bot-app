import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { MemoryHistory, createMemoryHistory } from 'history';
import { describe, expect, vi } from 'vitest';
import Commands from './commands';
import { screen } from '@testing-library/react';

type SutTypes = {
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const history = createMemoryHistory({ initialEntries: ['/discord/commands'] });
const makeSut = (): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Commands()
  });
  return {
    history,
    setCurrentAccountMock
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
});
