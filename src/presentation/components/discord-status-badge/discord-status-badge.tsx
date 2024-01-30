import { CommandDiscordStatus } from '@/domain/models';
import { Badge, Flex, Tooltip, chakra } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';

const CFaDiscord = chakra(FaDiscord);

export type Props = {
  value: CommandDiscordStatus | undefined;
};

const CustomBadge = ({ children, ...props }: { children: string; colorScheme?: string }): JSX.Element => (
  <Badge {...props} data-testid="discord-status-badge" p={2} borderRadius={5}>
    <Flex alignItems="center" gap={2}>
      <CFaDiscord />
      {children}
    </Flex>
  </Badge>
);

const DiscordStatusBadge = ({ value }: Props): JSX.Element => {
  switch (value) {
    case 'SENT':
      return <CustomBadge colorScheme="green">Sent</CustomBadge>;
    case 'RECEIVED':
      return <CustomBadge colorScheme="blue">Received</CustomBadge>;
    case 'FAILED':
      return <CustomBadge colorScheme="red">Failed</CustomBadge>;
    default:
      return (
        <Tooltip hasArrow label="To send command to Discord API please save command" placement="bottom">
          <CustomBadge>Not Sent</CustomBadge>
        </Tooltip>
      );
  }
};

export default DiscordStatusBadge;
