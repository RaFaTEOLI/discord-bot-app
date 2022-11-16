import { Spinner as ChakraSpinner } from '@chakra-ui/react';

const Spinner = (): JSX.Element => {
  return <ChakraSpinner data-testid="spinner" size="xl" />;
};

export default Spinner;
