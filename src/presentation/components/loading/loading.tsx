import { Flex, Text } from '@chakra-ui/react';
import Spinner from '../spinner/spinner';

const Loading = () => (
  <Flex data-testid="loading">
    <Text>Please Wait...</Text>
    <Spinner />
  </Flex>
);

export default Loading;