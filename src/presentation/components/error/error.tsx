import { Alert, AlertIcon, Button } from '@chakra-ui/react';
import { FiRotateCw } from 'react-icons/fi';

export type Props = {
  error: string;
  reload: () => void;
};

const Error = ({ error, reload }: Props): JSX.Element => {
  return (
    <Alert data-testid="error" status="error" display="flex" flexDir="column" borderRadius={5}>
      <AlertIcon />
      {error}
      <Button
        mt={5}
        size="sm"
        data-testid="reload"
        onClick={reload}
        leftIcon={<FiRotateCw />}
        colorScheme="teal"
        variant="solid"
      >
        Try again
      </Button>
    </Alert>
  );
};

export default Error;
