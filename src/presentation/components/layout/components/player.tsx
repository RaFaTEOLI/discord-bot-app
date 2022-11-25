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
import { useMemo } from 'react';
import { BsPlayCircleFill, BsShuffle, BsChevronRight, BsCircleFill, BsFillVolumeUpFill, BsJustify } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import { musicState } from './atom';

const PlayIcon = chakra(BsPlayCircleFill);
const ShuffleIcon = chakra(BsShuffle);
const NextIcon = chakra(BsChevronRight);
const VolumeIcon = chakra(BsFillVolumeUpFill);
const QueueIcon = chakra(BsJustify);
const CircleIcon = chakra(BsCircleFill);

export default function Player(): JSX.Element {
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const secondaryIconColor = useColorModeValue('gray', 'gray.300');
  const state = useRecoilValue(musicState);

  const music = useMemo(() => {
    if (state.name) {
      const song = state.name.split('-');
      console.log({ song });
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
          <ShuffleIcon size={15} color={secondaryIconColor} />
          <PlayIcon size={25} color={iconColor} />
          <NextIcon size={15} color={secondaryIconColor} />
        </HStack>
        <HStack>
          <Text fontSize="xs">{music?.name ? '2:49' : '0:00'}</Text>
          <Progress value={20} size="xs" colorScheme="gray" w="40vw" />
          <Text fontSize="xs">{music?.name ? '3:06' : '0:00'}</Text>
        </HStack>
      </GridItem>
      <GridItem mt={[5, 0]} display="flex" justifyContent={['center', 'flex-end']}>
        <HStack gap={3}>
          <QueueIcon size={15} color={secondaryIconColor} />
          <VolumeIcon size={15} color={secondaryIconColor} />
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
