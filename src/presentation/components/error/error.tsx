import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { FiRotateCw } from 'react-icons/fi';

type Props = {
  error: string;
  reload: () => void;
};

const Error = ({ error, reload }: Props): JSX.Element => {
  return (
    <Alert data-testid="error" status="error">
      <AlertIcon />
      {error}
      <Button data-testid="reload" onClick={reload} leftIcon={<FiRotateCw />} colorScheme="teal" variant="solid">
        Try again
      </Button>
    </Alert>
  );
};

export default Error;
