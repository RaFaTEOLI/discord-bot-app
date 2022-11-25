import { IconButton as ChakraIconButton, IconButtonProps } from '@chakra-ui/react';

export default function IconButton({ children, ...props }: IconButtonProps): JSX.Element {
  return (
    <ChakraIconButton size="xs" p={0} m={0} borderColor="transparent" variant="outline" {...props}>
      {children}
    </ChakraIconButton>
  );
}
