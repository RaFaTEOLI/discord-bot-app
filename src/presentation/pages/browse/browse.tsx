import { RunCommand, SpotifyRefreshToken, SpotifySearch } from '@/domain/usecases';
import { ConfirmationModal, Content, Error, Loading, TrackList } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { Flex, Box, useToast, Heading, chakra, useDisclosure } from '@chakra-ui/react';
import { MouseEvent, useEffect } from 'react';
import { HiNoSymbol } from 'react-icons/hi2';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { searchState, SearchContainer } from './components';

type Props = {
  spotifySearch: SpotifySearch;
  runCommand: RunCommand;
  refreshToken: SpotifyRefreshToken;
};

const CHiNoSymbol = chakra(HiNoSymbol);

export default function Browse({ spotifySearch, runCommand, refreshToken }: Props): JSX.Element {
  const resetSearchState = useResetRecoilState(searchState);
  const [state, setState] = useRecoilState(searchState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message }));
  }, refreshToken);

  useEffect(() => {
    resetSearchState();
  }, []);

  const handleSearch = async (): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true
      }));
      const search = await spotifySearch.search(state.value);
      setState(prev => ({
        ...prev,
        search
      }));
    } catch (error: any) {
      toast({
        title: 'Server Error',
        description: 'Something went wrong while trying to search',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
      handleError(error);
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const handlePlay = async (url: string, clearQueue: boolean): Promise<void> => {
    try {
      if (clearQueue) {
        await runCommand.run('clearQueue');
      }

      await runCommand.run(`play ${url}`);

      toast({
        title: 'Song Added',
        description: 'Your song was successfully added to the queue',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
      setState(prev => ({ ...prev, currentPlay: { url: '', music: false } }));
      onClose();
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Add Song Error',
        description: 'There was an error while trying to add your song to the queue',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const handlePrePlay = (event: MouseEvent<HTMLButtonElement>, url: string): void => {
    event.stopPropagation();
    setState(prev => ({ ...prev, currentPlay: { url } }));
    onOpen();
  };

  const confirm = (): void => {
    handlePlay(state.currentPlay.url, true);
  };

  const reject = (): void => {
    handlePlay(state.currentPlay.url, false);
  };

  const gridTableFontSize = [10, 12, 13, 14, 15];

  return (
    <Content title="Browse">
      <>
        {state.isLoading ? (
          <Flex alignItems="center" justifyContent="center">
            <Loading />
          </Flex>
        ) : (
          <Flex flexDir="column">
            {state.error ? (
              <Flex justifyContent="center" alignItems="center">
                <Box w="md">
                  <Error error={state.error} reload={handleSearch} />
                </Box>
              </Flex>
            ) : (
              <Flex w="100%" flexDirection="column" data-testid="browse-container">
                <SearchContainer onClick={handleSearch} />
                {state.search?.tracks.items.length ? (
                  <TrackList
                    tracks={state.search.tracks.items}
                    gridTableFontSize={gridTableFontSize}
                    handlePrePlay={handlePrePlay}
                    h="60vh"
                  />
                ) : (
                  <Flex flexDir="column" h="250px" justifyContent="center" alignItems="center">
                    <CHiNoSymbol size={90} mb={2} />
                    <Heading size="md" data-testeid="nothing-to-show">
                      Nothing to show...
                    </Heading>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        )}
        <ConfirmationModal
          loading={state.isLoading}
          isOpen={isOpen}
          onClose={onClose}
          confirm={confirm}
          reject={reject}
          description={'Do you want to clear the queue before playing?'}
        />
      </>
    </Content>
  );
}
