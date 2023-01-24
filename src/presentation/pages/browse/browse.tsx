import { SpotifySearch } from '@/domain/usecases';
import { Content, Error, Loading } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { Flex, Box, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { searchState, SearchContainer } from './components';

type Props = {
  spotifySearch: SpotifySearch;
};

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
            </Flex>
          )}
        </Flex>
      )}
    </Content>
  );
}
