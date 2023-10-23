import { SpotifyPlaylistModel } from '@/domain/models';
import { Box, Flex, IconButton, Image, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';
import { HiPlay } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { ConfirmationModal } from '@/presentation/components';
import { useRecoilValue } from 'recoil';
import { userPlaylistsState } from './atom';

type Props = {
  playlists: SpotifyPlaylistModel[];
  handleView: (id: string) => void;
  handlePlay: (url: string, clearQueue?: boolean) => void;
};

export default function PlaylistListItem({ playlists, handleView, handlePlay }: Props): JSX.Element {
  const color = useColorModeValue('gray.50', 'gray.900');
  const hoverColor = useColorModeValue('gray.100', 'gray.700');
  const [currentHover, setCurrentHover] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const state = useRecoilValue(userPlaylistsState);

  const handleMouseEnter = (playlistId: string): void => {
    setCurrentHover(playlistId);
  };

  const handleMouseLeave = (): void => {
    setCurrentHover(null);
  };

  const handlePrePlay = (event: MouseEvent<HTMLButtonElement>, url: string): void => {
    event.stopPropagation();
    setUrl(url);
    onOpen();
  };

  const confirm = (): void => {
    handlePlay(url, true);
    setUrl('');
    onClose();
  };

  const reject = (): void => {
    handlePlay(url);
    setUrl('');
  };

  const animate = {
    y: -12,
    opacity: 1
  };

  return (
    <Flex direction={['column', 'row']} flexWrap="wrap" gap={5} data-testid="playlists-list">
      {playlists.map(playlist => (
        <Box
          bgColor={currentHover === playlist.id ? hoverColor : color}
          key={playlist.id}
          w={[230, 280]}
          h={[250, 370]}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          cursor="pointer"
          onMouseEnter={() => handleMouseEnter(playlist.id)}
          onMouseLeave={handleMouseLeave}
          className="playlist-view-button"
          onClick={() => handleView(playlist.id)}
        >
          <Box p="6">
            <Box display="flex" justifyContent="center" position="relative">
              <Image width={225} height={225} src={playlist.images[0].url} alt={`Album ${playlist.name}`} />

              <motion.div
                initial={{ opacity: 0 }}
                transition={{ ease: 'easeOut', duration: 0.5 }}
                {...(currentHover === playlist.id && { animate })}
              >
                <IconButton
                  display={currentHover === playlist.id ? 'flex' : 'none'}
                  data-display={currentHover === playlist.id ? 'flex' : 'none'}
                  position="absolute"
                  right={3}
                  bottom={0}
                  className="playlist-play-button"
                  variant="solid"
                  borderRadius={50}
                  size="lg"
                  colorScheme="green"
                  aria-label="Play Playlist"
                  icon={<HiPlay />}
                  onClick={event => handlePrePlay(event, playlist.external_urls.spotify)}
                />
              </motion.div>
            </Box>

            <Box mt="3" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1} className="playlist-name">
              {playlist.name}
            </Box>

            <Flex flexDir="column" justifyContent="space-between">
              <Box mt={2} className="playlist-description" h="2.5rem" noOfLines={2} fontSize={14}>
                {playlist.description}
              </Box>
            </Flex>
          </Box>
        </Box>
      ))}
      <ConfirmationModal
        loading={state.isLoading}
        isOpen={isOpen}
        onClose={onClose}
        confirm={confirm}
        reject={reject}
        description={'Do you want to clear the queue before playing?'}
      />
    </Flex>
  );
}
