import { AccessTokenExpiredError } from '@/domain/errors';
import { LoadPlaylistTracks } from '@/domain/usecases';
import { Error, Loading } from '@/presentation/components';
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
  useToast
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { useParams } from 'react-router';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { InputFilter, userPlaylistState } from './components';

type Props = {
  loadPlaylistTracks: LoadPlaylistTracks;
};

export default function Playlist({ loadPlaylistTracks }: Props): JSX.Element {
  const color = useColorModeValue('gray.600', 'gray.400');
  const trackColor = useColorModeValue('gray.50', 'gray.900');
  const trackHoverColor = useColorModeValue('gray.100', 'gray.700');
  const resetUserPlaylistState = useResetRecoilState(userPlaylistState);
  const [state, setState] = useRecoilState(userPlaylistState);
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

  return (
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
        <VStack w="100%">
          <Flex w="100%" flexDirection={['column', 'column', 'column', 'row']} gap={3} data-testid="playlist-header">
            <Image
              boxSize="200px"
              src={state.playlist.images[0].url}
              alt={state.playlist.name}
              data-testid="playlist-image-url"
            />
            <Flex flexDir="column" h="200px" justifyContent="space-between" w="100%">
              <Text>Public Playlist</Text>
              <Text fontSize={50} fontWeight={700} data-testid="playlist-name">
                {state.playlist.name}
              </Text>
              <Text color={color} fontSize="sm" data-testid="playlist-description">
                {state.playlist.description}
              </Text>
              <Flex justifyContent="space-between" w="100%" flexDirection={['column', 'column', 'column', 'row']}>
                <HStack>
                  <Avatar
                    size="sm"
                    name="Rafael Tessarollo"
                    data-testid="playlist-owner-image-url"
                    src="https://scontent-ams2-1.xx.fbcdn.net/v/t1.18169-1/18199154_1201124763332887_8123261132169986051_n.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-7&_nc_sid=0c64ff&_nc_ohc=Sa3dIE_3nZQAX-bRbDz&_nc_ht=scontent-ams2-1.xx&edm=AP4hL3IEAAAA&oh=00_AfCG0nZkDks6gW8i6aexxX7Xvk8PlZgJcCQi_kVS_p-Vkw&oe=63BA4985"
                  />
                  <Text data-testid="playlist-song-count">
                    <b>{state.playlist.owner.display_name}</b> • 99 Songs
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
              templateColumns="repeat(5, 1fr)"
              alignItems="center"
              gap={6}
            >
              <GridItem w="100%">
                <Text>Title</Text>
              </GridItem>
              <GridItem w="100%">
                <Text>Album</Text>
              </GridItem>
              <GridItem w="100%">
                <Text>Added at</Text>
              </GridItem>
              <GridItem w="100%">
                <Text>Duration</Text>
              </GridItem>
            </Grid>

            <Grid
              borderRadius={5}
              cursor="pointer"
              w="100%"
              bgColor={trackColor}
              _hover={{ bg: trackHoverColor }}
              templateColumns="repeat(5, 1fr)"
              alignItems="center"
              gap={6}
            >
              <GridItem w="100%">
                <Flex alignItems="center" gap={3}>
                  <Image boxSize="70px" src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
                  <Flex flexDirection="column">
                    <Text fontWeight={600}>Numb</Text>
                    <Text fontWeight={300}>Linkin Park</Text>
                  </Flex>
                </Flex>
              </GridItem>
              <GridItem w="100%">
                <Text fontWeight={300}>Meteora</Text>
              </GridItem>
              <GridItem w="100%">
                <Text fontWeight={300}>15 de set. de 2020</Text>
              </GridItem>
              <GridItem w="100%">
                <Text fontWeight={300}>3:06</Text>
              </GridItem>
              <GridItem w="100%">
                <Flex justifyContent="flex-end" pr={5}>
                  <IconButton
                    className="song-play-button"
                    variant="solid"
                    borderRadius={50}
                    size="lg"
                    colorScheme="green"
                    aria-label="Play Song"
                    icon={<HiPlay />}
                  />
                </Flex>
              </GridItem>
            </Grid>
          </VStack>
        </VStack>
      )}
    </Flex>
  );
}
