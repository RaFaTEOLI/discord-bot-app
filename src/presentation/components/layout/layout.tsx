import { Box, Flex, Text, useColorModeValue, chakra } from '@chakra-ui/react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { HiHome, HiCommandLine } from 'react-icons/hi2';
import { Outlet, useLocation } from 'react-router';
import { ThemeSwitcher } from '@/presentation/components';
import Logo from '../logo/logo';
import NavItem from './components/nav-item';
import UserMenu from './components/user-menu';

const HomeIcon = chakra(HiHome);
const CommandsIcon = chakra(HiCommandLine);

export default function Layout(): JSX.Element {
  const sidebarColor = useColorModeValue('gray.100', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [navSize, setNavSize] = useState<string>('large');
  const location = useLocation();

  useLayoutEffect(() => {
    function updateSize(): void {
      if (window.innerWidth <= 767) {
        setNavSize('small');
      } else {
        setNavSize('large');
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const currentRoute = useMemo(() => {
    const pathname = location.pathname.split('/');
    return `/${pathname[1]}`;
  }, [location]);

  const toggleSidebar = (): void => {
    if (navSize === 'small') {
      setNavSize('large');
    } else {
      setNavSize('small');
    }
  };

  return (
    <Flex flexDir="column">
      <Flex justifyContent="space-between" bg={borderColor}>
        <Flex
          pos="sticky"
          left="0"
          h="88vh"
          mr="1px"
          w={navSize === 'small' ? '75px' : '300px'}
          data-testid="nav-flex"
          data-status={navSize === 'small' ? 'small' : 'large'}
          flexDir="column"
          justifyContent="space-between"
          bgColor={sidebarColor}
          borderBottomWidth={1.5}
          borderBottomColor={borderColor}
        >
          <Flex p="1%" flexDir="column" alignItems={navSize === 'small' ? 'center' : 'flex-start'} as="nav">
            <Box p={2} display="flex" alignItems="center">
              <Logo data-testid="bot-logo" onClick={toggleSidebar} width="82px" height="82px" />
              {navSize !== 'small' && (
                <Flex flexDir="column">
                  <Text data-testid="bot-name" fontSize="4xl" fontWeight={700} color="green" onClick={toggleSidebar}>
                    {process.env.VITE_BOT_NAME}
                  </Text>
                  <ThemeSwitcher />
                </Flex>
              )}
            </Box>
            <NavItem testName="home" active={currentRoute === '/'} to="/" title="Home" icon={HomeIcon} navSize={navSize} />
            <NavItem
              testName="commands"
              active={currentRoute === '/commands'}
              to="/commands"
              title="Commands"
              icon={CommandsIcon}
              navSize={navSize}
            />
          </Flex>
        </Flex>
        <Box
          w="100%"
          p={8}
          borderLeftWidth={1.5}
          borderLeftColor={borderColor}
          borderBottomWidth={1.5}
          borderBottomColor={borderColor}
          bg={useColorModeValue('white', 'gray.800')}
          data-testid="page-outlet"
          position="relative"
          overflowX="hidden"
        >
          <UserMenu />
          <Outlet />
        </Box>
      </Flex>
      <Flex h="full">
        <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
          Player
        </Box>
      </Flex>
    </Flex>
  );
}
