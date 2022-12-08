import { AccessTokenExpiredError } from '@/domain/errors';
import { LoadUserPlaylists, RunCommand } from '@/domain/usecases';
import { Content, Error, Loading } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { userPlaylistsState, InputFilter, PlaylistListItem } from './components';

type Props = {
  loadUserPlaylists: LoadUserPlaylists;
  runCommand: RunCommand;
};

export default function Playlists({ loadUserPlaylists, runCommand }: Props): JSX.Element {
  const resetUserPlaylistState = useResetRecoilState(userPlaylistsState);
  const [state, setState] = useRecoilState(userPlaylistsState);
  const navigate = useNavigate();
  const toast = useToast();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message, reload: false }));
  });

  const reload = (): void =>
    setState(prev => ({ ...prev, playlists: [], error: '', reload: !prev.reload, isLoading: true }));

  useEffect(() => {
    (async () => {
      resetUserPlaylistState();
      try {
        const { items } = await loadUserPlaylists.all();
        setState(prev => ({ ...prev, playlists: items, isLoading: false }));
      } catch (error: any) {
        if (error instanceof AccessTokenExpiredError) {
          toast({
            title: 'Access Denied',
            description: 'Your login with spotify is either expired or invalid, please log in with spotify again!',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        } else {
          toast({
            title: 'Server Error',
            description: 'Something went wrong while trying to load playlists',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        }
        handleError(error);
      }
    })();
  }, [state.reload]);

  const onPlay = async (url: string): Promise<void> => {
    try {
      await runCommand.run(`playlist ${url}`);
      toast({
        title: 'Playlist Added',
        description: 'Your playlist was successfully added to the queue',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Add Playlist Error',
        description: 'There was an error while trying to add your playlist to the queue',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  return (
    <>
      <Content title="Playlists">
        {state.isLoading ? (
          <Flex alignItems="center" justifyContent="center">
            <Loading />
          </Flex>
        ) : (
          <Flex flexDir="column">
            <Flex justifyContent="space-between" p={0} pb={5} pr={9}>
              <InputFilter borderRightRadius={5} />
            </Flex>
            {state.error ? (
              <Flex justifyContent="center" alignItems="center">
                <Box w="md">
                  <Error error={state.error} reload={reload} />
                </Box>
              </Flex>
            ) : (
              <PlaylistListItem
                handleView={(id: string) => navigate(`/playlists/${id}`)}
                handlePlay={onPlay}
                playlists={state.filteredPlaylists}
              />
            )}
          </Flex>
        )}
      </Content>
    </>
  );
}
