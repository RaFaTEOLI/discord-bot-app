import { Flex, Menu, Link, MenuButton, Icon, Text, useColorModeValue, ChakraComponent } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router';

interface INavItemProps {
  navSize: string;
  icon: IconType | ChakraComponent<IconType>;
  title: string | JSX.Element;
  testName: string;
  to: string;
  active: boolean;
}

const NavItem = ({ navSize, icon, title, active, to, testName }: INavItemProps): JSX.Element => {
  const navigate = useNavigate();
  const color = useColorModeValue('gray.500', 'gray.300');
  const backgroundColor = useColorModeValue('gray.200', 'gray.700');
  const activeBackgroundColor = useColorModeValue('whiteAlpha.900', 'gray.800');

  const navigateTo = (route: string): void => {
    navigate(route);
  };

  const boxShadowStyle = active ? { boxShadow: 'base' } : null;

  return (
    <Flex
      data-testid={testName}
      data-status={active ? 'active' : 'not-active'}
      data-size={navSize === 'small' ? 'small' : 'large'}
      p={1.5}
      flexDir="column"
      w="100%"
      alignItems={navSize === 'small' ? 'center' : 'flex-start'}
    >
      <Menu placement="right">
        <Link
          data-testid={`${testName}-link`}
          onClick={() => navigateTo(to)}
          backgroundColor={active ? activeBackgroundColor : ''}
          p={2}
          borderRadius={10}
          _hover={{ textDecor: 'none', backgroundColor }}
          w={navSize === 'large' ? '100%' : 'none'}
          {...boxShadowStyle}
          rounded="md"
          display="flex"
          alignItems="center"
        >
          <MenuButton w="100%" alignItems="center">
            <Flex ml={navSize === 'small' ? 0 : 2}>
              <Icon as={icon} fontSize="xl" color={active ? 'green.500' : color} />
              <Text
                color={active ? 'green.500' : color}
                ml={3}
                fontSize="sm"
                fontWeight={500}
                display={navSize === 'small' ? 'none' : 'flex'}
                data-testid={`${testName}-text`}
              >
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
};

export default NavItem;
