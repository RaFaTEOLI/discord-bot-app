import { SpotifySearch } from '@/domain/usecases';
import { Content, Error, Loading, TrackList } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { Flex, Box, useToast, Heading, chakra } from '@chakra-ui/react';
import { MouseEvent, useEffect } from 'react';
import { HiNoSymbol } from 'react-icons/hi2';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { searchState, SearchContainer } from './components';

type Props = {
  spotifySearch: SpotifySearch;
};

const CHiNoSymbol = chakra(HiNoSymbol);

export default function Browse({ spotifySearch }: Props): JSX.Element {
  const resetSearchState = useResetRecoilState(searchState);
  const [state, setState] = useRecoilState(searchState);

  const toast = useToast();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message }));
  });

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

  const handlePrePlay = (event: MouseEvent<HTMLButtonElement>, url: string, music = false): void => {
    event.stopPropagation();
    // setState(prev => ({ ...prev, currentPlay: { url, music } }));
    // onOpen();
  };

  const gridTableFontSize = [10, 12, 13, 14, 15];

  return (
    <Content title="Browse">
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
                  <Heading size="md">Nothing to show...</Heading>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      )}
    </Content>
  );
}
