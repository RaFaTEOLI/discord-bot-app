import { homeState } from './index';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

export default function ChannelsList(): JSX.Element {
  const color = useColorModeValue('gray.50', 'gray.900');
  const hoverColor = useColorModeValue('gray.100', 'gray.700');
  const state = useRecoilValue(homeState);
  return (
    <Flex direction={['column', 'row']} flexWrap="wrap" gap={5} mt={2} w="100%" data-testid="channels-list">
      {state.server.channels.map(({ id, name }) => (
        <Box
          key={id}
          borderRadius={5}
          w="14rem"
          h="3rem"
          bgColor={color}
          _hover={{ bg: hoverColor }}
          display="flex"
          alignItems="center"
          gap={6}
          p={2}
        >
          {name}
        </Box>
      ))}
    </Flex>
  );
}
