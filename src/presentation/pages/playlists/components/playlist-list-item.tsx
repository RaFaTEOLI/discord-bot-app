import { SpotifyPlaylistModel } from '@/domain/models';
import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { HiEye, HiPlay } from 'react-icons/hi2';

type Props = {
  playlists: SpotifyPlaylistModel[];
  handleView: (id: string) => void;
  handlePlay: (url: string) => void;
};

export default function PlaylistListItem({ playlists, handleView, handlePlay }: Props): JSX.Element {
  return (
    <Flex direction={['column', 'row']} flexWrap="wrap" gap={5} data-testid="playlists-list">
      {playlists.map(playlist => (
        <Box key={playlist.id} w={[230, 280]} borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Box p="6">
            <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1} className="playlist-name">
              {playlist.name}
            </Box>

            <Flex flexDir="column" justifyContent="space-between">
              <Box className="playlist-description" h="3rem">
                {playlist.description}
              </Box>

              <Box display="flex" mt="2" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Tooltip label="View Playlist">
                    <IconButton
                      className="playlist-view-button"
                      variant="outline"
                      size="sm"
                      colorScheme="blue"
                      aria-label="View Playlist"
                      icon={<HiEye />}
                      onClick={() => handleView(playlist.id)}
                    />
                  </Tooltip>
                  <Tooltip label="Play Playlist">
                    <IconButton
                      className="playlist-play-button"
                      variant="outline"
                      size="sm"
                      colorScheme="green"
                      aria-label="Play Playlist"
                      icon={<HiPlay />}
                      onClick={() => handlePlay(playlist.external_urls.spotify)}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Box>
      ))}
    </Flex>
  );
}
