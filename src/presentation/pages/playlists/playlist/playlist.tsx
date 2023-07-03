import { AccessTokenExpiredError } from '@/domain/errors';
import { LoadPlaylistTracks, LoadUserById, RunCommand, SpotifyRefreshToken } from '@/domain/usecases';
import { ConfirmationModal, Error, Loading, TrackList } from '@/presentation/components';
import { useErrorHandler } from '@/presentation/hooks';
import {
  Avatar,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  useColorModeValue,
  VStack,
  Box,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import { HiPlay } from 'react-icons/hi2';
import { useParams } from 'react-router';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { InputFilter, userPlaylistState } from './components';
import { MouseEvent, useEffect } from 'react';

type Props = {
  loadPlaylistTracks: LoadPlaylistTracks;
  runCommand: RunCommand;
  loadUserById: LoadUserById;
  refreshToken: SpotifyRefreshToken;
};

export default function Playlist({ loadPlaylistTracks, runCommand, loadUserById, refreshToken }: Props): JSX.Element {
  const color = useColorModeValue('gray.600', 'gray.400');
  const resetUserPlaylistState = useResetRecoilState(userPlaylistState);
  const [state, setState] = useRecoilState(userPlaylistState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const toast = useToast();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message, reload: false }));
  }, refreshToken);

  const reload = (): void =>
    setState(prev => ({ ...prev, playlists: [], error: '', reload: !prev.reload, isLoading: true }));

  useEffect(() => {
    resetUserPlaylistState();
    (async () => {
      try {
        const playlist = await loadPlaylistTracks.load(id as string);
        const playlistOwner = await loadUserById.loadById(playlist.owner.id);
        setState(prev => ({
          ...prev,
          isLoading: false,
          playlist,
          playlistOwner
        }));
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

  const handlePlay = async (url: string, clearQueue: boolean, music: boolean): Promise<void> => {
    try {
      if (clearQueue) {
        await runCommand.run('clearQueue');
      }
      if (music) {
        await runCommand.run(`play ${url}`);
      } else {
        await runCommand.run(`playlist ${url}`);
      }

      toast({
        title: `${music ? 'Song' : 'Playlist'} Added`,
        description: `Your ${music ? 'song' : 'playlist'} was successfully added to the queue`,
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
        title: `Add ${music ? 'Song' : 'Playlist'} Error`,
        description: `There was an error while trying to add your ${music ? 'song' : 'playlist'} to the queue`,
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const handlePrePlay = (event: MouseEvent<HTMLButtonElement>, url: string, music = false): void => {
    event.stopPropagation();
    setState(prev => ({ ...prev, currentPlay: { url, music } }));
    onOpen();
  };

  const confirm = (): void => {
    handlePlay(state.currentPlay.url, true, state.currentPlay.music);
  };

  const reject = (): void => {
    handlePlay(state.currentPlay.url, false, state.currentPlay.music);
  };

  const gridTableFontSize = [10, 12, 13, 14, 15];

  return (
    <>
      <Flex alignItems="center" gap={3} data-testid="playlist-container" w="100%">
        {state.isLoading ? (
          <Flex alignItems="center" justifyContent="center">
            <Loading />
          </Flex>
        ) : state.error ? (
          <Flex justifyContent="center" alignItems="center">
            <Box w="md">
              <Error error={state.error} reload={reload} />
            </Box>
          </Flex>
        ) : (
          <VStack w="100%" h="82vh">
            <Flex
              w="100%"
              flexDirection={['column', 'column', 'column', 'column', 'row']}
              gap={3}
              data-testid="playlist-header"
            >
              <Image
                boxSize={['35px', '40px', '80px', '150px', '200px']}
                src={state.playlist.images[0].url}
                alt={state.playlist.name}
                data-testid="playlist-image-url"
              />
              <Flex flexDir="column" h="200px" justifyContent="space-between" w="100%">
                <Text>Public Playlist</Text>
                <Text fontWeight={700} data-testid="playlist-name" fontSize={[12, 20, 30, 40, 50]}>
                  {state.playlist.name}
                </Text>
                <Text color={color} fontSize="sm" data-testid="playlist-description">
                  {state.playlist.description}
                </Text>
                <Flex
                  justifyContent="space-between"
                  w="100%"
                  flexDirection={['column', 'column', 'column', 'column', 'row']}
                >
                  <HStack>
                    <Avatar
                      size="sm"
                      name={state.playlistOwner.display_name}
                      data-testid="playlist-owner-image-url"
                      src={state.playlistOwner.images.length ? state.playlistOwner.images[0].url : ''}
                    />
                    <Text data-testid="playlist-song-count">
                      <b>{state.playlist.owner.display_name}</b> • {state.playlist.tracks.total} Songs
                    </Text>
                  </HStack>
                  <HStack>
                    <InputFilter borderRightRadius={5} />
                    <IconButton
                      data-testid="playlist-play-button"
                      className="playlist-play-button"
                      variant="solid"
                      borderRadius={50}
                      size="lg"
                      colorScheme="green"
                      aria-label="Play Playlist"
                      onClick={event => handlePrePlay(event, state.playlist.external_urls.spotify)}
                      icon={<HiPlay />}
                    />
                  </HStack>
                </Flex>
              </Flex>
            </Flex>

            <TrackList tracks={state.filteredTracks} gridTableFontSize={gridTableFontSize} handlePrePlay={handlePrePlay} />
          </VStack>
        )}
      </Flex>
      <ConfirmationModal
        loading={state.isLoading}
        isOpen={isOpen}
        onClose={onClose}
        confirm={confirm}
        reject={reject}
        description={'Do you want to clear the queue before playing?'}
      />
    </>
  );
}
