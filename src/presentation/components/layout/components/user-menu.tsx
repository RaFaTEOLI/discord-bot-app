import { Box, Flex, Avatar, Menu, MenuButton, Text, Button, MenuList, MenuItem, chakra } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp, FiLogOut } from 'react-icons/fi';
import { HiUser } from 'react-icons/hi2';
import { FaSpotify } from 'react-icons/fa';
import { useLogout } from '@/presentation/hooks';
import { currentAccountState } from '@/presentation/components';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

const CFaSpotify = chakra(FaSpotify);
const CFiChevronUp = chakra(FiChevronUp);
const CFiChevronDown = chakra(FiChevronDown);

export default function UserMenu(): JSX.Element {
  const logout = useLogout();
  const navigate = useNavigate();
  const { getCurrentAccount } = useRecoilValue(currentAccountState);

  const buttonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    logout();
  };

  const userName = useMemo(() => {
    return getCurrentAccount().user.name.split(' ')[0];
  }, [getCurrentAccount()]);

  return (
    <Box position="absolute" right={8}>
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              data-testid="user-menu"
              p={0}
              borderRadius={20}
              isActive={isOpen}
              as={Button}
              rightIcon={
                isOpen ? (
                  <CFiChevronUp mr={2} data-testid="user-menu-up" />
                ) : (
                  <CFiChevronDown mr={2} data-testid="user-menu-down" />
                )
              }
            >
              <Flex alignItems="center" justifyContent="center">
                <Avatar
                  m={1}
                  size="sm"
                  name="Dan Abrahmov"
                  src="https://scontent-ams2-1.xx.fbcdn.net/v/t1.18169-1/18199154_1201124763332887_8123261132169986051_n.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-7&_nc_sid=0c64ff&_nc_ohc=Rn2c6enhA5QAX-7iBtg&_nc_ht=scontent-ams2-1.xx&edm=AP4hL3IEAAAA&oh=00_AfCaRC4YNSLmmYB9JjEoqeEp01EAPLCLTL2wFt_Le5nokQ&oe=63940E05"
                />
                <Text fontSize="sm" m={3} data-testid="user-name">
                  {userName}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList data-testid="user-menu-list">
              <MenuItem icon={<HiUser />} data-testid="user-profile" onClick={() => navigate('/profile')}>
                Profile
              </MenuItem>
              <MenuItem icon={<CFaSpotify color="green" />} isDisabled>
                Linked with Spotify
              </MenuItem>
              <MenuItem data-testid="logout" icon={<FiLogOut />} onClick={buttonClick}>
                Log Out
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </Box>
  );
}
