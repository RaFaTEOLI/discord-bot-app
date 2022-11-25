import { IconButton as ChakraIconButton } from '@chakra-ui/react';

export default function IconButton({
  onClick = () => {},
  children,
  ...props
}: {
  onClick?: any;
  children: JSX.Element;
}): JSX.Element {
  return (
    <ChakraIconButton
      onClick={onClick}
      size="xs"
      aria-label="Shuffle"
      p={0}
      m={0}
      borderColor="transparent"
      variant="outline"
      {...props}
    >
      {children}
    </ChakraIconButton>
  );
}
