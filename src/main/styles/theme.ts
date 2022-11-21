import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

// eslint-disable-next-line
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac'
  }
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true
};

const fonts = {
  body: 'Poppins',
  heading: 'Poppins',
  text: 'Poppins',
  a: 'Poppins'
};

const styles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global: (props: Dict<any>) => ({
    '*': {
      fontFamily: 'Poppins, sans-serif',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    'input:focus, textarea:focus, select:focus, div:focus': {
      outline: 'none'
    },
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('white', 'gray.800')(props),
      lineHeight: 'base'
    },
    '*::placeholder': {
      color: mode('gray.400', 'whiteAlpha.400')(props)
    },
    '*, *::before, &::after': {
      borderColor: mode('gray.200', 'whiteAlpha.300')(props),
      wordWrap: 'break-word'
    },
    a: {
      color: 'teal.500',
      _hover: {
        textDecoration: 'teal.500'
      }
    },
    '::-webkit-scrollbar': {
      width: '5px',
      height: '5px'
    },
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1'
    },

    '::-webkit-scrollbar-thumb': {
      background: '#888'
    },

    '::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
  })
};

const theme = extendTheme({ config, styles, fonts });
export default theme;
