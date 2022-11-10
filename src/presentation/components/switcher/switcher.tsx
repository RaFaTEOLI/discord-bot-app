import { Box, BoxProps } from '@chakra-ui/react';
import ThemeSwitcher from '../theme-switcher/theme-switcher';

const Switcher = ({ mt = 0 }: BoxProps): JSX.Element => {
  return (
    <Box mt={mt}>
      <ThemeSwitcher />
    </Box>
  );
};

export default Switcher;
