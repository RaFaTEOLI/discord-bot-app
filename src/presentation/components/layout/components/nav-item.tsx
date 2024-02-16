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
import { IconType } from 'react-icons';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { useNavigate } from 'react-router';

interface INavItemProps {
  navSize: string;
  icon: IconType | ChakraComponent<IconType>;
  title: string | JSX.Element;
  testName: string;
  to: string;
  active: boolean;
  subItems?: Array<{
    id: string;
    title: string;
    to: string;
    icon: IconType | ChakraComponent<IconType>;
  }>;
}

const ChevronUp = chakra(HiChevronUp);
const ChevronDown = chakra(HiChevronDown);

const NavItem = ({ navSize, icon, title, active, to, testName, subItems }: INavItemProps): JSX.Element => {
  const navigate = useNavigate();
  const color = useColorModeValue('gray.500', 'gray.300');
  const backgroundColor = useColorModeValue('gray.200', 'gray.700');
  const activeBackgroundColor = useColorModeValue('whiteAlpha.900', 'gray.800');

  const subBackgroundColor = useColorModeValue('gray.200', 'gray.700');
  const subActiveBackgroundColor = useColorModeValue('whiteAlpha.800', 'gray.700');

  const { isOpen, onToggle } = useDisclosure();

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
          onClick={() => {
            if (subItems) {
              onToggle();
            } else {
              navigateTo(to);
            }
          }}
          backgroundColor={active ? activeBackgroundColor : ''}
          p={2}
          borderRadius={10}
          borderBottomRadius={isOpen ? 0 : 10}
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
                data-display={navSize === 'small' ? 'none' : 'flex'}
                data-testid={`${testName}-text`}
              >
                {title}
              </Text>
            </Flex>
          </MenuButton>
          {subItems && <Icon as={isOpen ? ChevronUp : ChevronDown} fontSize="xl" color={active ? 'green.500' : color} />}
        </Link>
      </Menu>
      {subItems && (
        <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
          {subItems.map(({ id, icon, title, to }, index) => (
            <Menu placement="right" key={index}>
              <Link
                data-testid={`${id}-link`}
                data-open={!!isOpen}
                onClick={() => navigateTo(to)}
                backgroundColor={active ? subActiveBackgroundColor : ''}
                p={2}
                borderRadius={10}
                borderTopRadius={0}
                // TODO: Fix the hover effect
                _hover={{ textDecor: 'none', subBackgroundColor }}
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
