import { Switch, Box, Icon, useColorMode, BoxProps, chakra } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';

const CFiMoon = chakra(FiMoon);
const CFiSun = chakra(FiSun);

const ThemeSwitcher = ({ mt = 0 }: BoxProps): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconPosition = colorMode === 'light' ? { left: 1.5 } : { right: 1.5 };
  return (
    <Box>
      <Box position="relative" display="flex" alignItems="center" w="fit-content">
        <Switch isChecked={colorMode === 'light'} colorScheme="blue" onChange={toggleColorMode} size="lg" />
        <Icon
          data-testid={colorMode === 'light' ? 'sun' : 'moon'}
          color="white"
          position="absolute"
          {...iconPosition}
          as={colorMode === 'light' ? CFiSun : CFiMoon}
        />
      </Box>
    </Box>
  );
};

export default ThemeSwitcher;
