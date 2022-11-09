import { Alert, AlertIcon, Flex, Text } from '@chakra-ui/react';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
};

const FormStatus = ({ state }: Props): JSX.Element => {
  const { mainError } = state;
  return (
    <Flex data-testid="error-wrap">
      {mainError && (
        <Alert status="error" borderRadius={5}>
          <AlertIcon />
          <Text data-testid="main-error">{mainError}</Text>
        </Alert>
      )}
    </Flex>
  );
};

export default FormStatus;
