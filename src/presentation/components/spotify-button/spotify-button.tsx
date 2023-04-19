import { Button, chakra } from '@chakra-ui/react';
import { FaSpotify } from 'react-icons/fa';

const CFaSpotify = chakra(FaSpotify);

export type Props = {
  text: string;
  isLoading?: boolean | undefined;
  onClick?: () => any;
};

const SpotifyButton = ({ text, ...props }: Props): JSX.Element => {
  return (
    <Button
      colorScheme="green"
      {...props}
      variant="solid"
      w="full"
      leftIcon={<CFaSpotify />}
      data-testid="spotify-button"
      type="button"
    >
      {text}
    </Button>
  );
};

export default SpotifyButton;
