import { LoadServer } from '@/domain/usecases';
import { Content, Error, Loading } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { Heading, Flex, Box, Divider, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { homeState, ChannelsList, MembersList } from './components';

type Props = {
  loadServer: LoadServer;
};

export default function Home({ loadServer }: Props): JSX.Element {
  const resetHomeState = useResetRecoilState(homeState);
  const [state, setState] = useRecoilState(homeState);

  const toast = useToast();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message, reload: false }));
  });

  const reload = (): void =>
    setState(prev => ({ ...prev, playlists: [], error: '', reload: !prev.reload, isLoading: true }));

  useEffect(() => {
    resetHomeState();
    (async () => {
      try {
        const server = await loadServer.load();
        setState(prev => ({
          ...prev,
          isLoading: false,
          server
        }));
      } catch (error: any) {
        toast({
          title: 'Server Error',
          description: 'Something went wrong while trying to load playlists',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
        handleError(error);
      }
    })();
  }, [state.reload]);

  return (
    <Content title="Home">
      {state.isLoading ? (
        <Flex alignItems="center" justifyContent="center">
          <Loading />
        </Flex>
      ) : (
        <Flex flexDir="column">
          {state.error ? (
            <Flex justifyContent="center" alignItems="center">
              <Box w="md">
                <Error error={state.error} reload={reload} />
              </Box>
            </Flex>
          ) : (
            <Flex w="100%" flexDirection="column">
              <Heading size="md" data-testid="server-name">
                {state.server.name}
              </Heading>
              <Divider mb={5} mt={5} />

              <Heading size="md">Channels</Heading>
              <ChannelsList />

              <Divider mb={5} mt={5} />

              <Heading size="md">Members</Heading>
              <MembersList />
            </Flex>
          )}
        </Flex>
      )}
    </Content>
  );
}
