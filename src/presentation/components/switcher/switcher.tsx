import { Box, IconButton, useColorMode, BoxProps, chakra } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';

const CFiMoon = chakra(FiMoon);
const CFiSun = chakra(FiSun);

const Switcher = ({ mt = 0 }: BoxProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box borderWidth="1px" borderRadius="5px" mt={mt}>
      <IconButton
        data-testid="theme-switcher"
        w={['100%', 'auto', 'auto', 'auto']}
        variant="ghost"
        onClick={toggleColorMode}
        colorScheme="blue"
        aria-label="Toggle Mode"
        icon={colorMode === 'light' ? <CFiMoon data-testid="moon" /> : <CFiSun data-testid="sun" />}
      />
    </Box>
  );
};

export default Switcher;
