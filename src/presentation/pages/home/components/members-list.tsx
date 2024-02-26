import { homeState } from './index';
import { Avatar, AvatarBadge, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

export default function MembersList(): JSX.Element {
  const color = useColorModeValue('gray.50', 'gray.900');
  const hoverColor = useColorModeValue('gray.100', 'gray.700');
  const state = useRecoilValue(homeState);

  const getStatus = (status: string): string => {
    if (status === 'online') {
      return 'Online';
    } else if (status === 'dnd') {
      return 'Do Not Disturb';
    } else if (status === 'idle') {
      return 'Idle';
    }
    return status;
  };

  return (
    <Flex direction={['column', 'row']} flexWrap="wrap" gap={5} mt={2} w="100%" data-testid="members-list">
      {state.server.members.map(member => (
        <Box
          key={member.id}
          borderRadius={5}
          w={['90%', '14rem']}
          h="4rem"
          bgColor={color}
          _hover={{ bg: hoverColor }}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          gap={6}
          p={2}
        >
          <Avatar name="Rafael" src={member.avatar_url} size="md">
            <AvatarBadge
              className="user-badge-status"
              boxSize="1.25em"
              bg={member.status === 'online' ? 'green.500' : 'red.500'}
            />
          </Avatar>
          <Flex flexDirection="column">
            <Text>{member.username}</Text>
            <Text
              className="user-status"
              noOfLines={1}
              fontSize="xs"
              color={member.status === 'online' ? 'green.500' : 'red.500'}
            >
              {getStatus(member.game ? member.game.name : member.status)}
            </Text>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}
