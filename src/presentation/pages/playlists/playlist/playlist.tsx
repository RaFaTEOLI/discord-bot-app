import { AccessTokenExpiredError } from '@/domain/errors';
import { LoadPlaylistTracks, RunCommand } from '@/domain/usecases';
import { ConfirmationModal, Error, Loading } from '@/presentation/components';
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
  Grid,
  GridItem,
  Box,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import { HiPlay } from 'react-icons/hi2';
import { useParams } from 'react-router';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { InputFilter, userPlaylistState } from './components';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { MouseEvent, useEffect, useState } from 'react';

type Props = {
  loadPlaylistTracks: LoadPlaylistTracks;
  runCommand: RunCommand;
};

export default function Playlist({ loadPlaylistTracks, runCommand }: Props): JSX.Element {
  const color = useColorModeValue('gray.600', 'gray.400');
  const trackColor = useColorModeValue('gray.50', 'gray.900');
  const trackHoverColor = useColorModeValue('gray.100', 'gray.700');
  const resetUserPlaylistState = useResetRecoilState(userPlaylistState);
  const [state, setState] = useRecoilState(userPlaylistState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPlay, setCurrentPlay] = useState<{ url: string; music: boolean }>({ url: '', music: false });
  const { id } = useParams();
  const toast = useToast();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message, reload: false }));
  });

  const reload = (): void =>
    setState(prev => ({ ...prev, playlists: [], error: '', reload: !prev.reload, isLoading: true }));

  useEffect(() => {
    resetUserPlaylistState();
    (async () => {
      try {
        const playlist = await loadPlaylistTracks.load(id as string);
        setState(prev => ({
          ...prev,
          isLoading: false,
          playlist
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

  const getFormattedTime = (time: number): string => {
    const duration = intervalToDuration({ start: 0, end: time * 1000 });

    const zeroPad = (num: any): string => String(num).padStart(2, '0');

    return formatDuration(duration, {
      format: ['minutes', 'seconds'],
      zero: true,
      delimiter: ':',
      locale: {
        formatDistance: (_token, count) => zeroPad(count)
      }
    });
  };

  const handlePlay = async (url: string, clearQueue = false, music = false): Promise<void> => {
    try {
      if (clearQueue) {
        await runCommand.run('stop');
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
      setCurrentPlay({ url: '', music: false });
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
    setCurrentPlay({ url, music });
    onOpen();
  };

  const confirm = (): void => {
    handlePlay(currentPlay.url, true, currentPlay.music);
  };

  const reject = (): void => {
    handlePlay(currentPlay.url, false, currentPlay.music);
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
                      name="Rafael Tessarollo"
                      data-testid="playlist-owner-image-url"
                      src="https://scontent-ams2-1.xx.fbcdn.net/v/t1.18169-1/18199154_1201124763332887_8123261132169986051_n.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-7&_nc_sid=0c64ff&_nc_ohc=Sa3dIE_3nZQAX-bRbDz&_nc_ht=scontent-ams2-1.xx&edm=AP4hL3IEAAAA&oh=00_AfCG0nZkDks6gW8i6aexxX7Xvk8PlZgJcCQi_kVS_p-Vkw&oe=63BA4985"
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
            <VStack w="100%" justifyContent="flex-start">
              <Grid
                mt={5}
                borderRadius={5}
                cursor="pointer"
                w="100%"
                templateColumns={['repeat(1, 1fr)', 'repeat(4, 1fr)']}
                alignItems="center"
                gap={6}
              >
                <GridItem w={['100%', '100%', '100%', '100%', '25rem']}>
                  <Text fontSize={gridTableFontSize}>Title</Text>
                </GridItem>
                <GridItem w="100%" display={['none', 'block']}>
                  <Text fontSize={gridTableFontSize}>Album</Text>
                </GridItem>
                <GridItem w="100%" display={['none', 'block']}>
                  <Text fontSize={gridTableFontSize}>Added at</Text>
                </GridItem>
                <GridItem w="100%" display={['none', 'block']}>
                  <Text fontSize={gridTableFontSize}>Duration</Text>
                </GridItem>
              </Grid>

              <VStack w="100%" justifyContent="flex-start" overflowY="scroll" h="48vh" data-testid="tracks-list">
                {state.filteredTracks.map(({ track, ...trackInfo }) => (
                  <Grid
                    key={track.id}
                    borderRadius={5}
                    cursor="pointer"
                    w="100%"
                    bgColor={trackColor}
                    _hover={{ bg: trackHoverColor }}
                    templateColumns={['repeat(1, 1fr)', 'repeat(4, 1fr)']}
                    alignItems="center"
                    gap={6}
                    position="relative"
                  >
                    <GridItem w={['100%', '100%', '100%', '100%', '25rem']} h={['45px', '55px', '65px', '68px', '70px']}>
                      <Flex alignItems="center" gap={3}>
                        <Image
                          boxSize={['45px', '55px', '65px', '68px', '70px']}
                          src={track.album.images[0].url}
                          alt={track.album.name}
                        />
                        <Flex flexDirection="column">
                          <Text className="track-name" fontSize={gridTableFontSize} fontWeight={600}>
                            {track.name}
                          </Text>
                          <Text className="track-artist" fontSize={gridTableFontSize} fontWeight={300}>
                            {track.artists[0].name}
                          </Text>
                        </Flex>
                      </Flex>
                    </GridItem>
                    <GridItem w="100%" display={['none', 'block']}>
                      <Text fontSize={gridTableFontSize} fontWeight={300}>
                        {track.album.name}
                      </Text>
                    </GridItem>
                    <GridItem w="100%" display={['none', 'block']}>
                      <Text fontSize={gridTableFontSize} fontWeight={300}>
                        {format(new Date(trackInfo.added_at), 'PP')}
                      </Text>
                    </GridItem>
                    <GridItem w="100%" display={['none', 'block']}>
                      <Text fontSize={gridTableFontSize} fontWeight={300}>
                        {getFormattedTime(track.duration_ms / 1000)}
                      </Text>
                    </GridItem>
                    <Flex right={0} pr={5} position="absolute">
                      <IconButton
                        className="song-play-button"
                        variant="solid"
                        borderRadius={50}
                        size={['xs', 'sm']}
                        colorScheme="green"
                        aria-label="Play Song"
                        onClick={event => handlePrePlay(event, track.external_urls.spotify, true)}
                        icon={<HiPlay />}
                      />
                    </Flex>
                  </Grid>
                ))}
              </VStack>
            </VStack>
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
