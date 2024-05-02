/* eslint-disable react/prop-types */
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
import { HiPlay, HiTrash } from 'react-icons/hi2';
import { useRecoilValue } from 'recoil';
import { playerState } from './atom';
import IconButton from './icon-button';
import { motion } from 'framer-motion';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd';
import { QueueModel } from '@/domain/models';
import { MdDragIndicator } from 'react-icons/md';

const PlayIcon = chakra(BsPlayCircleFill);
const PauseIcon = chakra(BsPauseCircleFill);
const ShuffleIcon = chakra(BsShuffle);
const NextIcon = chakra(BsChevronRight);
const VolumeIcon = chakra(BsFillVolumeUpFill);
const VolumeMuteIcon = chakra(BsFillVolumeMuteFill);
const QueueIcon = chakra(BsJustify);
const CircleIcon = chakra(BsCircleFill);
const DragIcon = chakra(MdDragIndicator);

type Props = {
  onResume: () => Promise<void>;
  onPause: () => Promise<void>;
  onShuffle: () => Promise<void>;
  onSkip: (index?: number) => Promise<void>;
  onVolumeChange: (volume: number) => Promise<void>;
  onRemove: (index: number) => Promise<void>;
};

export default function Player({ onResume, onPause, onShuffle, onSkip, onVolumeChange, onRemove }: Props): JSX.Element {
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const secondaryIconColor = useColorModeValue('gray', 'gray.300');
  const state = useRecoilValue(playerState);
  const [paused, setPaused] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(-1);
  const [sliding, setSliding] = useState<boolean>(false);
  const [skippedIndex, setSkippedIndex] = useState<number>(1);
  const [queue, setQueue] = useState(state.queue);

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);

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

  useEffect(() => {
    if (state.queue.length) {
      const queueList = [...state.queue];
      setQueue(queueList.splice(skippedIndex, 8));
    } else {
      setQueue(state.queue);
    }
  }, [state.queue, skippedIndex]);

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
      onVolumeChange(Number(volume * 2));
    }
  }, [volume]);

  const handleVolumeChange = async (): Promise<void> => {
    await onVolumeChange(Number(volume * 2));
    setSliding(false);
  };

  const handleQueueSkip = (index: number): void => {
    onSkip(index);
    setSkippedIndex(prev => prev + index + 1);
  };

  const handleRemove = (index: number): void => {
    onRemove(index + 1);
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const SongItem = ({
    song,
    index,
    provided,
    snapshot
  }: {
    song: QueueModel;
    index: number;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
  }): JSX.Element => (
    <Box
      w="100%"
      key={song.id}
      className="music-queue"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(undefined)}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Box gap={3} w="100%" display="flex" alignItems="center">
        <DragIcon size={45} color={snapshot.isDragging ? 'gray.500' : 'white'} />
        <ChakraIconButton
          className="song-play-button"
          variant="solid"
          borderRadius={50}
          size={['xs', 'sm']}
          colorScheme="green"
          aria-label="Play Song"
          onClick={async () => handleQueueSkip(index)}
          icon={<HiPlay />}
        />
        <Text className="queue-song-name" fontSize="sm" noOfLines={1} w="90%">
          {song.name}
        </Text>
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.5 }}
          {...(hoveredIndex === index && {
            animate: {
              opacity: 1
            }
          })}
        >
          <ChakraIconButton
            className="song-remove-button"
            variant="outline"
            borderRadius={50}
            size={['xs', 'sm']}
            colorScheme="red"
            aria-label="Remove Song"
            onClick={async () => handleRemove(index)}
            icon={<HiTrash />}
          />
        </motion.div>
      </Box>
      {index < queue.length - 1 && <Divider mt={1} />}
    </Box>
  );

  const reorder = (list: QueueModel[], startIndex: number, endIndex: number): QueueModel[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any): void => {
    if (!result.destination) {
      return;
    }

    const items = reorder(queue, result.source.index, result.destination.index);
    setQueue(items);
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
            <PopoverContent w={['85vw', '85vw', '45vw', '30vw']}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Queue</PopoverHeader>
              <PopoverBody>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="droppable"
                    renderClone={(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot,
                      rubric: DraggableRubric
                    ) => (
                      <SongItem
                        song={queue[rubric.source.index]}
                        index={rubric.source.index}
                        provided={provided}
                        snapshot={snapshot}
                      />
                    )}
                  >
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                      <VStack gap={2} data-testid="queue-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {queue.length ? (
                          <>
                            {queue.map((song, index) => (
                              <Draggable key={song.id} draggableId={song.id} index={index}>
                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                  <SongItem song={song} index={index} provided={provided} snapshot={snapshot} />
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </>
                        ) : (
                          <Text fontSize="sm" noOfLines={1} w="90%" data-testid="empty-queue">
                            Queue is empty
                          </Text>
                        )}
                      </VStack>
                    )}
                  </Droppable>
                </DragDropContext>
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
