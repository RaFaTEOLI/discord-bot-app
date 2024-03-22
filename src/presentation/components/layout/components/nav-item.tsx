import {
  Flex,
  Menu,
  Link,
  MenuButton,
  Icon,
  Text,
  useColorModeValue,
  ChakraComponent,
  Collapse,
  useDisclosure,
  chakra
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { IconType } from 'react-icons';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { useNavigate } from 'react-router';

interface INavItemProps {
  navSize: string;
  icon: IconType | ChakraComponent<IconType>;
  title: string | JSX.Element;
  testName: string;
  to: string;
  currentRoute: string;
  subItems?: Array<{
    id: string;
    title: string;
    to: string;
    icon: IconType | ChakraComponent<IconType>;
  }>;
}

const ChevronUp = chakra(HiChevronUp);
const ChevronDown = chakra(HiChevronDown);

const NavItem = ({ navSize, icon, title, currentRoute, to, testName, subItems }: INavItemProps): JSX.Element => {
  const navigate = useNavigate();
  const color = useColorModeValue('gray.500', 'gray.300');
  const backgroundColor = useColorModeValue('gray.200', 'gray.700');
  const activeBackgroundColor = useColorModeValue('whiteAlpha.900', 'gray.800');

  const subActiveBackgroundColor = useColorModeValue('whiteAlpha.800', 'gray.700');

  const { isOpen, onToggle } = useDisclosure();

  const navigateTo = (route: string): void => {
    navigate(route);
  };

  const isMainActive = useCallback(
    (route: string): boolean => {
      if (subItems) {
        return subItems.some(item => item.to === currentRoute);
      }
      return currentRoute === route;
    },
    [currentRoute]
  );
  const isActive = useCallback((route: string): boolean => currentRoute === route, [currentRoute]);

  const boxShadowStyle = useMemo(() => (isMainActive(to) ? { boxShadow: 'base' } : null), [isActive, to]);

  return (
    <Flex
      data-testid={testName}
      data-status={isMainActive(to) ? 'active' : 'not-active'}
      data-size={navSize === 'small' ? 'small' : 'large'}
      p={1.5}
      flexDir="column"
      w="100%"
      alignItems={navSize === 'small' ? 'center' : 'flex-start'}
    >
      <Menu placement="right">
        <Link
          data-testid={`${testName}-link`}
          onClick={() => {
            if (subItems) {
              onToggle();
            } else {
              navigateTo(to);
            }
          }}
          backgroundColor={isMainActive(to) ? activeBackgroundColor : ''}
          p={2}
          borderRadius={10}
          borderBottomRadius={isOpen ? 0 : 10}
          _hover={{ textDecor: 'none', backgroundColor }}
          w={navSize === 'large' ? '100%' : 'none'}
          {...boxShadowStyle}
          rounded="md"
          display="flex"
          alignItems="center"
          borderLeftColor={subItems && navSize === 'small' ? 'blue.400' : 'green.500'}
          borderLeftRadius={0}
          borderLeftWidth={4}
        >
          <MenuButton w="100%" alignItems="center">
            <Flex ml={navSize === 'small' ? 0 : 2}>
              <Icon as={icon} fontSize="xl" color={isMainActive(to) ? 'green.500' : color} />
              <Text
                color={isMainActive(to) ? 'green.500' : color}
                ml={3}
                fontSize="sm"
                fontWeight={500}
                display={navSize === 'small' ? 'none' : 'flex'}
                data-display={navSize === 'small' ? 'none' : 'flex'}
                data-testid={`${testName}-text`}
              >
                {title}
              </Text>
            </Flex>
          </MenuButton>
          {subItems && navSize !== 'small' && (
            <Icon
              data-testid={`${testName}-subitem-chevron`}
              as={isOpen ? ChevronUp : ChevronDown}
              fontSize="xl"
              color={isMainActive(to) ? 'green.500' : color}
            />
          )}
        </Link>
      </Menu>
      {subItems && (
        <Collapse in={isOpen} animateOpacity style={{ width: navSize === 'small' ? '75%' : '100%' }}>
          {subItems.map(({ id, icon, title, to }, index) => (
            <Menu placement="right" key={index}>
              <Link
                data-testid={`${id}-link`}
                data-open={!!isOpen}
                onClick={() => navigateTo(to)}
                backgroundColor={isActive(to) ? subActiveBackgroundColor : ''}
                p={2}
                borderRadius={10}
                borderTopRadius={0}
                borderBottomRadius={index === subItems.length - 1 ? 10 : 0}
                _hover={{ textDecor: 'none', backgroundColor }}
                w={navSize === 'large' ? '100%' : 'none'}
                {...boxShadowStyle}
                rounded="md"
                display="flex"
                alignItems="center"
                borderLeftColor={'gray.800'}
                borderLeftRadius={0}
                borderLeftWidth={4}
              >
                <MenuButton w="100%" alignItems="center">
                  <Flex ml={navSize === 'small' ? 0 : 2}>
                    <Icon as={icon} fontSize="xl" color={isActive(to) ? 'green.500' : color} />
                    <Text
                      color={isActive(to) ? 'green.500' : color}
                      ml={3}
                      fontSize="sm"
                      fontWeight={500}
                      display={navSize === 'small' ? 'none' : 'flex'}
                      data-display={navSize === 'small' ? 'none' : 'flex'}
                      data-testid={`${id}-text`}
                    >
                      {title}
                    </Text>
                  </Flex>
                </MenuButton>
              </Link>
            </Menu>
          ))}
        </Collapse>
      )}
    </Flex>
  );
};

export default NavItem;
