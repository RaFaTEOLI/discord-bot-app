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

type Props = {
  onSpotifySignUp: () => void;
};

export default function UserMenu({ onSpotifySignUp }: Props): JSX.Element {
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

  const isLinkedWithSpotify = useMemo(() => !!getCurrentAccount().user.spotify?.accessToken, [getCurrentAccount()]);

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
                  name={getCurrentAccount().user.name}
                  src={getCurrentAccount().user.spotify?.avatarUrl}
                />
                <Text fontSize="sm" m={3} data-testid="user-name">
                  {userName}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList data-testid="user-menu-list">
              <MenuItem
                icon={<HiUser />}
                data-testid="user-profile"
                onClick={() => navigate('/profile')}
                isDisabled={!isLinkedWithSpotify}
              >
                Profile
              </MenuItem>
              <MenuItem
                data-testid="link-spotify"
                onClick={onSpotifySignUp}
                icon={<CFaSpotify color="#1DB954" />}
                isDisabled={isLinkedWithSpotify}
              >
                {isLinkedWithSpotify ? 'Linked with Spotify' : 'Link with Spotify'}
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
