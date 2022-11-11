import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import Router from './routes/router';
import theme from './styles/theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <Router />
  </ChakraProvider>
);
