import { Flex } from '@chakra-ui/react';
import { Spinner } from '@/presentation/components';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
};

const FormStatus = ({ state }: Props) => {
  const { isLoading, mainError } = state;
  return (
    <Flex data-testid="error-wrap">
      {isLoading && <Spinner />}
      {mainError && <span data-testid="main-error">{mainError}</span>}
    </Flex>
  );
};

export default FormStatus;
