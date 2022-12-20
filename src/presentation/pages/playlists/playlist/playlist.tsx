import { Loading } from '@/presentation/components';
import { Avatar, Flex, HStack, IconButton, Image, Text, useColorModeValue, VStack, Grid, GridItem } from '@chakra-ui/react';
import { useEffect } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { InputFilter, userPlaylistState } from './components';

export default function Playlist(): JSX.Element {
  const color = useColorModeValue('gray.600', 'gray.400');
  const trackColor = useColorModeValue('gray.50', 'gray.900');
  const trackHoverColor = useColorModeValue('gray.100', 'gray.700');
  const resetUserPlaylistState = useResetRecoilState(userPlaylistState);
  const [state, setState] = useRecoilState(userPlaylistState);

  useEffect(() => {
    resetUserPlaylistState();
    setState(prev => ({
      ...prev,
      isLoading: false,
      playlist: {
        collaborative: false,
        description: 'Spotify Wrapped presents the songs that you loved most this year.',
        external_urls: {
          spotify: 'https://open.spotify.com/playlist/37i9dQZF1F0sijgNaJdgit'
        },
        followers: {
          href: null,
          total: 0
        },
        href: 'https://api.spotify.com/v1/playlists/37i9dQZF1F0sijgNaJdgit',
        id: '37i9dQZF1F0sijgNaJdgit',
        images: [
          {
            height: null,
            url: 'https://wrapped-images.spotifycdn.com/image/yts-2022/large/your-top-songs-2022_large_en.jpg',
            width: null
          }
        ],
        name: 'Your Top Songs 2022',
        owner: {
          display_name: 'Spotify',
          external_urls: {
            spotify: 'https://open.spotify.com/user/spotify'
          },
          href: 'https://api.spotify.com/v1/users/spotify',
          id: 'spotify',
          type: 'user',
          uri: 'spotify:user:spotify'
        },
        primary_color: null,
        public: false,
        snapshot_id: 'MTY2OTkwODk2MiwwMDAwMDAwMGI0OTJhMThjN2Q2M2M1MjMzYjBmMzU5ZTM4MDdhMGRj',
        tracks: {
          href: 'https://api.spotify.com/v1/playlists/37i9dQZF1F0sijgNaJdgit/tracks?offset=0&limit=100',
          limit: 100,
          next: 'https://api.spotify.com/v1/playlists/37i9dQZF1F0sijgNaJdgit/tracks?offset=100&limit=100',
          offset: 0,
          previous: null,
          total: 101
        },
        type: 'playlist',
        uri: 'spotify:playlist:37i9dQZF1F0sijgNaJdgit'
      }
    }));
  }, []);

  return (
    <Flex alignItems="center" gap={3} data-testid="playlist-container" w="100%">
      {state.isLoading ? (
        <Flex alignItems="center" justifyContent="center">
          <Loading />
        </Flex>
      ) : (
        <VStack w="100%">
          <Flex w="100%" flexDirection={['column', 'column', 'column', 'row']} gap={3} data-testid="playlist-header">
            <Image boxSize="200px" src={state.playlist.images[0].url} alt={state.playlist.name} />
            <Flex flexDir="column" h="200px" justifyContent="space-between" w="100%">
              <Text>Public Playlist</Text>
              <Text fontSize={50} fontWeight={700}>
                {state.playlist.name}
              </Text>
              <Text color={color} fontSize="sm">
                {state.playlist.description}
              </Text>
              <Flex justifyContent="space-between" w="100%" flexDirection={['column', 'column', 'column', 'row']}>
                <HStack>
                  <Avatar
                    size="sm"
                    name="Rafael Tessarollo"
                    src="https://scontent-ams2-1.xx.fbcdn.net/v/t1.18169-1/18199154_1201124763332887_8123261132169986051_n.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-7&_nc_sid=0c64ff&_nc_ohc=Sa3dIE_3nZQAX-bRbDz&_nc_ht=scontent-ams2-1.xx&edm=AP4hL3IEAAAA&oh=00_AfCG0nZkDks6gW8i6aexxX7Xvk8PlZgJcCQi_kVS_p-Vkw&oe=63BA4985"
                  />
                  <Text>
                    <b>{state.playlist.owner.display_name}</b> • 99 Songs
                  </Text>
                </HStack>
                <HStack>
                  <InputFilter borderRightRadius={5} />
                  <IconButton
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
