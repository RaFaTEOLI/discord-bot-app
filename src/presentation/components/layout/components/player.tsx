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
  GridItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  IconButton as ChakraIconButton,
  VStack,
  Divider
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsShuffle,
  BsChevronRight,
  BsCircleFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsJustify
} from 'react-icons/bs';
import { HiMusicalNote } from 'react-icons/hi2';
import { useRecoilValue } from 'recoil';
import { playerState } from './atom';
import IconButton from './icon-button';

const PlayIcon = chakra(BsPlayCircleFill);
const PauseIcon = chakra(BsPauseCircleFill);
const ShuffleIcon = chakra(BsShuffle);
const NextIcon = chakra(BsChevronRight);
const VolumeIcon = chakra(BsFillVolumeUpFill);
const VolumeMuteIcon = chakra(BsFillVolumeMuteFill);
const QueueIcon = chakra(BsJustify);
const CircleIcon = chakra(BsCircleFill);
const MusicIcon = chakra(HiMusicalNote);

type Props = {
  onResume: () => Promise<void>;
  onPause: () => Promise<void>;
  onShuffle: () => Promise<void>;
  onSkip: () => Promise<void>;
  onVolumeChange: (volume: number) => Promise<void>;
};

export default function Player({ onResume, onPause, onShuffle, onSkip, onVolumeChange }: Props): JSX.Element {
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const secondaryIconColor = useColorModeValue('gray', 'gray.300');
  const state = useRecoilValue(playerState);
  const [paused, setPaused] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(-1);
  const [sliding, setSliding] = useState<boolean>(false);

  const music = useMemo(() => {
    if (state.music.name) {
      const song = state.music.name.split('-');
      if (song.length > 1) {
        return {
          author: song[0].trim(),
          name: song[1].trim()
        };
      }
      return {
        author: 'Unknown',
        name: state.music.name
      };
    }
  }, [state.music]);

  const queue = useMemo(() => {
    if (state.queue.length) {
      const queueList = [...state.queue];
      return queueList.splice(1, 8);
    } else {
      return state.queue;
    }
  }, [state.queue]);

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

  const handleSkip = (): void => {
    onSkip();
  };

  const handleVolumeClick = (): void => {
    setVolume(prev => (prev === 0 ? 50 : 0));
  };

  useEffect(() => {
    if (volume >= 0 && !sliding) {
      onVolumeChange(volume);
    }
  }, [volume]);

  const handleVolumeChange = async (): Promise<void> => {
    if (volume >= 0) {
      await onVolumeChange(volume);
      setSliding(false);
    } else {
      setSliding(false);
    }
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
              src={state.music.thumbnail ?? 'https://via.placeholder.com/150'}
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
          <IconButton aria-label="Shuffle Music" onClick={handleShuffle} data-testid="shuffle-music">
            <ShuffleIcon size={15} color={secondaryIconColor} />
          </IconButton>
          <IconButton aria-label="Play/Pause Music" onClick={handlePlayPause} data-testid="play-pause-music">
            {paused ? <PlayIcon size={25} color={iconColor} /> : <PauseIcon size={25} color={iconColor} />}
          </IconButton>
          <IconButton aria-label="Skip Music" onClick={handleSkip} data-testid="skip-music">
            <NextIcon size={15} color={secondaryIconColor} />
          </IconButton>
        </HStack>
        <HStack>
          <Progress value={0} size="xs" colorScheme="gray" w="40vw" />
          <Text fontSize="xs">{music?.name ? state.music.duration : '0:00'}</Text>
        </HStack>
      </GridItem>
      <GridItem mt={[5, 0]} display="flex" justifyContent={['center', 'flex-end']}>
        <HStack gap={3}>
          <Popover data-testid="queue-container">
            <PopoverTrigger>
              <ChakraIconButton
                data-testid="show-queue"
                aria-label="Queue"
                size="xs"
                p={0}
                m={0}
                borderColor="transparent"
                variant="outline"
              >
                <QueueIcon size={15} color={secondaryIconColor} />
              </ChakraIconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Queue</PopoverHeader>
              <PopoverBody>
                <VStack gap={2} data-testid="queue-list">
                  {queue.length ? (
                    queue.map((song, index) => (
                      <Box w="100%" key={song.id} className="music-queue">
                        <Box gap={3} w="100%" display="flex" alignItems="center">
                          <MusicIcon color="blue.400" size={20} />
                          <Text className="queue-song-name" fontSize="sm" noOfLines={1} w="90%">
                            {song.name}
                          </Text>
                        </Box>
                        {index < queue.length - 1 && <Divider mt={1} />}
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="sm" noOfLines={1} w="90%" data-testid="empty-queue">
                      Queue is empty
                    </Text>
                  )}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <IconButton onClick={handleVolumeClick} aria-label="Volume" data-testid="music-volume">
            {volume === 0 ? (
              <VolumeMuteIcon size={15} color={secondaryIconColor} />
            ) : (
              <VolumeIcon size={15} color={secondaryIconColor} />
            )}
          </IconButton>
          <Slider
            onChangeEnd={handleVolumeChange}
            onChange={val => {
              setSliding(true);
              setVolume(val);
            }}
            aria-label="slider"
            colorScheme="gray"
            defaultValue={50}
            value={volume === -1 ? 50 : volume}
            w={['60vw', '5vw']}
            data-testid="volume-slider"
          >
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
