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
  Box
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
        name: song
      };
    }
  }, [state]);

  return (
    <Flex w="100vw" justifyContent="space-between" alignItems="center" p={4} data-testid="player">
      <Flex gap={3}>
        <Image
          boxSize="56px"
          objectFit="cover"
          src="https://i.scdn.co/image/ab67616d00004851b4ad7ebaf4575f120eb3f193"
          alt="Song Album"
        />
        <Flex flexDir="column" justifyContent="center">
          <Text as="b" fontSize="sm" data-testid="music-name">
            {music?.name ?? 'Not Playing'}
          </Text>
          <Text fontSize="xs" data-testid="music-author">
            {music?.author ?? '-'}
          </Text>
        </Flex>
      </Flex>
      <Flex flexDir="column" alignItems="center" gap={3}>
        <HStack spacing={5}>
          <ShuffleIcon size={15} color={secondaryIconColor} />
          <PlayIcon size={25} color={iconColor} />
          <NextIcon size={15} color={secondaryIconColor} />
        </HStack>
        <HStack>
          <Text fontSize="xs">2:49</Text>
          <Progress value={20} size="xs" colorScheme="gray" w="40vw" />
          <Text fontSize="xs">3:06</Text>
        </HStack>
      </Flex>
      <HStack gap={3}>
        <QueueIcon size={15} color={secondaryIconColor} />
        <VolumeIcon size={15} color={secondaryIconColor} />
        <Slider aria-label="slider" colorScheme="gray" defaultValue={50} w="5vw">
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={2}>
            <Box color={secondaryIconColor} as={CircleIcon} />
          </SliderThumb>
        </Slider>
      </HStack>
    </Flex>
  );
}
