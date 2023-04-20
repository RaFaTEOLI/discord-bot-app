import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/main/styles/theme';

export default function Wrapper({ children }: { children: JSX.Element }): JSX.Element {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
