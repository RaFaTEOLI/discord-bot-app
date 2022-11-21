import { Flex, Box, Heading } from '@chakra-ui/react';

export default function Content({ title, children }: { title: string; children: JSX.Element }): JSX.Element {
  return (
    <Flex flexDir="column">
      <Heading mb={5} size={['md', 'xl']}>
        {title}
      </Heading>
      <Box h="72vh" overflowY="scroll">
        {children}
      </Box>
    </Flex>
  );
}
