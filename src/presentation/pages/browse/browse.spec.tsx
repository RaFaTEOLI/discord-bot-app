import { UnexpectedError } from '@/domain/errors';
import { SpotifySearchSpy } from '@/domain/mocks';
import { AccountModel } from '@/domain/models';
import { renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Browse from './browse';
import { setTimeout } from 'timers/promises';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
  history: MemoryHistory;
  spotifySearchSpy: SpotifySearchSpy;
};

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    __esModule: true,
    ...originalModule,
    useToast: jest.fn().mockImplementation(() => mockToast)
  };
});
const history = createMemoryHistory({ initialEntries: ['/'] });
const makeSut = (spotifySearchSpy = new SpotifySearchSpy()): SutTypes => {
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    useAct: true,
    Page: () => Browse({ spotifySearch: spotifySearchSpy })
  });
  return { setCurrentAccountMock, spotifySearchSpy, history };
};

describe('Browse Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have browse page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Browse'
    });
    expect(pageContent).toBeInTheDocument();
  });

  test('should call SpotifySearch', async () => {
    const { spotifySearchSpy } = makeSut();
    await waitFor(() => screen.getByTestId('browse-container'));
    await userEvent.click(screen.getByTestId('search-song-button'));
    expect(spotifySearchSpy.callsCount).toBe(1);
  });

  test('should render error on UnexpectedError on SpotifySearch', async () => {
    const spotifySearchSpy = new SpotifySearchSpy();
    const error = new UnexpectedError();
    jest.spyOn(spotifySearchSpy, 'search').mockRejectedValueOnce(error);
    makeSut(spotifySearchSpy);
    await waitFor(() => screen.getByTestId('browse-container'));
    await userEvent.click(screen.getByTestId('search-song-button'));
    await setTimeout(500);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Server Error',
      description: 'Something went wrong while trying to search',
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  });
});
