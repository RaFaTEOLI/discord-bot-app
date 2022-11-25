import {
  chakra,
  Flex,
  Image,
  Progress,
  HStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Box,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsShuffle,
  BsChevronRight,
  BsCircleFill,
  BsFillVolumeUpFill,
  BsJustify
} from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import { musicState } from './atom';
import IconButton from './icon-button';

const PlayIcon = chakra(BsPlayCircleFill);
const PauseIcon = chakra(BsPauseCircleFill);
const ShuffleIcon = chakra(BsShuffle);
const NextIcon = chakra(BsChevronRight);
const VolumeIcon = chakra(BsFillVolumeUpFill);
const QueueIcon = chakra(BsJustify);
const CircleIcon = chakra(BsCircleFill);

type Props = {
  onResume: () => Promise<void>;
  onPause: () => Promise<void>;
  onShuffle: () => Promise<void>;
};

export default function Player({ onResume, onPause, onShuffle }: Props): JSX.Element {
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const secondaryIconColor = useColorModeValue('gray', 'gray.300');
  const state = useRecoilValue(musicState);
  const [paused, setPaused] = useState<boolean>(false);

  const music = useMemo(() => {
    if (state.name) {
      const song = state.name.split('-');
      if (song.length > 1) {
        return {
          author: song[0].trim(),
          name: song[1].trim()
        };
      }
      return {
        author: 'Unknown',
        name: state.name
      };
    }
  }, [state]);

  const handlePlayPause = (): void => {
    setPaused(prev => {
      if (prev) {
        onResume();
      } else {
        onPause();
      }
      return !prev;
    });
  };

  const handleShuffle = (): void => {
    onShuffle();
  };

  return (
    <Grid
      templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
      p={4}
      justifyContent="space-between"
      alignItems="center"
      data-testid="player"
    >
      <GridItem gap={3} display="flex">
        {music?.name ? (
          <>
            <Image
              data-testid="music-thumbnail"
              boxSize="56px"
              objectFit="cover"
              src={state.thumbnail ?? 'https://via.placeholder.com/150'}
              alt="Song Album"
            />
            <Flex flexDir="column" justifyContent="center">
              <Text as="b" fontSize="sm" data-testid="music-name">
                {music.name.substring(0, 40)}
                {music.name.length > 40 && '...'}
              </Text>
              <Text fontSize="xs" data-testid="music-author">
                {music.author}
              </Text>
            </Flex>
          </>
        ) : (
          <Box w="8vw" data-testid="empty-song"></Box>
        )}
      </GridItem>
      <GridItem mt={[5, 0]} display="flex" flexDir="column" alignItems="center" gap={3}>
        <HStack spacing={5}>
          <IconButton onClick={handleShuffle} data-testid="shuffle-music">
            <ShuffleIcon size={15} color={secondaryIconColor} />
          </IconButton>
          <IconButton onClick={handlePlayPause} data-testid="play-pause-music">
            {paused ? <PlayIcon size={25} color={iconColor} /> : <PauseIcon size={25} color={iconColor} />}
          </IconButton>
          <IconButton>
            <NextIcon size={15} color={secondaryIconColor} />
          </IconButton>
        </HStack>
        <HStack>
          <Progress value={0} size="xs" colorScheme="gray" w="40vw" />
          <Text fontSize="xs">{music?.name ? state.duration : '0:00'}</Text>
        </HStack>
      </GridItem>
      <GridItem mt={[5, 0]} display="flex" justifyContent={['center', 'flex-end']}>
        <HStack gap={3}>
          <IconButton>
            <QueueIcon size={15} color={secondaryIconColor} />
          </IconButton>
          <IconButton>
            <VolumeIcon size={15} color={secondaryIconColor} />
          </IconButton>
          <Slider aria-label="slider" colorScheme="gray" defaultValue={50} w={['60vw', '5vw']}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={2}>
              <Box color={secondaryIconColor} as={CircleIcon} />
            </SliderThumb>
          </Slider>
        </HStack>
      </GridItem>
    </Grid>
  );
}
