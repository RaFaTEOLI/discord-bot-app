import { Flex, Box, Heading } from '@chakra-ui/react';

export interface Props {
  title: string;
  children: JSX.Element;
}

export default function Content({ title, children }: Props): JSX.Element {
  return (
    <Flex flexDir="column">
      <Heading mb={5} size={['md', 'xl']}>
        {title}
      </Heading>
      <Box h="72vh" overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
