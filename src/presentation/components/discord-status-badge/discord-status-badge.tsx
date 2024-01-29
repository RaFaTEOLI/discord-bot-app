import { Badge } from '@chakra-ui/react';

type Props = {
  value: 'SENT' | 'RECEIVED' | 'FAILED';
};

const DiscordStatusBadge = ({ value }: Props): JSX.Element => {
  switch (value) {
    case 'SENT':
      return (
        <Badge colorScheme="green" data-testid="discord-status-badge">
          Sent
        </Badge>
      );
    case 'RECEIVED':
      return (
        <Badge colorScheme="blue" data-testid="discord-status-badge">
          Received
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge colorScheme="red" data-testid="discord-status-badge">
          Failed
        </Badge>
      );
    default:
      return <Badge data-testid="discord-status-badge">NOT SENT</Badge>;
  }
};

export default DiscordStatusBadge;
