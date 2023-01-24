import { MouseEvent } from 'react';
import { Flex, Grid, GridItem, IconButton, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { HiPlay } from 'react-icons/hi2';
import { format, formatDuration, intervalToDuration } from 'date-fns';

type Props = {
  tracks: any;
  gridTableFontSize: number[];
  handlePrePlay: (event: MouseEvent<HTMLButtonElement>, url: string, music?: boolean) => void;
  h?: string;
};

export default function TrackList({ tracks, gridTableFontSize, handlePrePlay, h = '48vh' }: Props): JSX.Element {
  const trackColor = useColorModeValue('gray.50', 'gray.900');
  const trackHoverColor = useColorModeValue('gray.100', 'gray.700');

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

  console.log(tracks);

  return (
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

      <VStack w="100%" justifyContent="flex-start" overflowY="scroll" h={h} data-testid="tracks-list">
        {tracks.map((trackInfo: any) => (
          <Grid
            key={trackInfo.track ? trackInfo.track.id : trackInfo.id}
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
                  src={trackInfo.track ? trackInfo.track.album.images[0].url : trackInfo.album.images[0].url}
                  alt={trackInfo.track ? trackInfo.track.album.name : trackInfo.album.name}
                />
                <Flex flexDirection="column">
                  <Text className="track-name" fontSize={gridTableFontSize} fontWeight={600}>
                    {trackInfo.track ? trackInfo.track.name : trackInfo.name}
                  </Text>
                  <Text className="track-artist" fontSize={gridTableFontSize} fontWeight={300}>
                    {trackInfo.track ? trackInfo.track.artists[0].name : trackInfo.artists[0].name}
                  </Text>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem w="100%" display={['none', 'block']}>
              <Text fontSize={gridTableFontSize} fontWeight={300}>
                {trackInfo.track ? trackInfo.track.album.name : trackInfo.album.name}
              </Text>
            </GridItem>
            <GridItem w="100%" display={['none', 'block']}>
              <Text fontSize={gridTableFontSize} fontWeight={300}>
                {trackInfo.added_at ? format(new Date(trackInfo.added_at), 'PP') : '-'}
              </Text>
            </GridItem>
            <GridItem w="100%" display={['none', 'block']}>
              <Text fontSize={gridTableFontSize} fontWeight={300}>
                {getFormattedTime((trackInfo.track ? trackInfo.track.duration_ms : trackInfo.duration_ms) / 1000)}
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
                onClick={async event =>
                  handlePrePlay(
                    event,
                    trackInfo.track ? trackInfo.track.external_urls.spotify : trackInfo.external_urls.spotify,
                    true
                  )
                }
                icon={<HiPlay />}
              />
            </Flex>
          </Grid>
        ))}
      </VStack>
    </VStack>
  );
}
