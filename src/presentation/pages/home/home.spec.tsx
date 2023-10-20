import { UnexpectedError } from '@/domain/errors';
import { LoadServerSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Home from './home';
import { describe, test, expect, vi, beforeEach } from 'vitest';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  history: MemoryHistory;
  loadServerSpy: LoadServerSpy;
};

const mockToast = vi.fn();
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...(actual as any),
    useToast: vi.fn().mockImplementation(() => mockToast)
  };
});
const history = createMemoryHistory({ initialEntries: ['/'] });
const makeSut = (loadServerSpy = new LoadServerSpy()): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Home({ loadServer: loadServerSpy })
  });
  return { setCurrentAccountMock, loadServerSpy, history };
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have home page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Home'
    });
    expect(pageContent).toBeTruthy();
  });

  test('should call LoadServer', () => {
    const { loadServerSpy } = makeSut();
    expect(loadServerSpy.callsCount).toBe(1);
  });

  test('should show server channels', async () => {
    const { loadServerSpy } = makeSut();
    const channelsList = await screen.findByTestId('channels-list');
    await waitFor(() => channelsList);
    expect(channelsList.children).toHaveLength(loadServerSpy.server.channels.length);
  });

  test('should show server members', async () => {
    const { loadServerSpy } = makeSut();
    const membersList = await screen.findByTestId('members-list');
    await waitFor(() => membersList);
    expect(screen.getByTestId('server-name').textContent).toBe(loadServerSpy.server.name);
    expect(membersList.children).toHaveLength(loadServerSpy.server.members.length);
    expect(membersList.querySelectorAll('.user-status')[0].textContent).toBe(
      loadServerSpy.server.members[0].game?.name as string
    );
    expect(membersList.querySelectorAll('.user-status')[1].textContent).toBe(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      loadServerSpy.server.members[1].game?.name as string
    );
    expect(membersList.querySelectorAll('.user-status')[2].textContent).toBe('Online');
    expect(membersList.querySelectorAll('.user-status')[3].textContent).toBe('Do Not Disturb');
    expect(membersList.querySelectorAll('.user-status')[4].textContent).toBe('Idle');
  });

  test('should render error on UnexpectedError on LoadServer', async () => {
    const loadServerSpy = new LoadServerSpy();
    const error = new UnexpectedError();
    vi.spyOn(loadServerSpy, 'load').mockRejectedValueOnce(error);
    makeSut(loadServerSpy);
    await waitFor(() => screen.getByTestId('error'));
    expect(screen.queryByTestId('server-container')).not.toBeTruthy();
    const errorWrap = await screen.findByTestId('error');
    expect(errorWrap.textContent).toBe(`${error.message}Try again`);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Server Error',
      description: 'Something went wrong while trying to load server info',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });

  test('should call LoadServer on reload', async () => {
    const loadServerSpy = new LoadServerSpy();
    vi.spyOn(loadServerSpy, 'load').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadServerSpy);
    await waitFor(() => screen.getByTestId('error'));
    await userEvent.click(screen.getByTestId('reload'));
    await waitFor(() => screen.getByTestId('channels-list'));
    expect(loadServerSpy.callsCount).toBe(2);
  });
});
