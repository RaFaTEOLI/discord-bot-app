import { Flex } from '@chakra-ui/react';
import Spinner from '../spinner/spinner';

const Loading = (): JSX.Element => (
  <Flex data-testid="loading">
    <Spinner />
  </Flex>
);

export default Loading;
