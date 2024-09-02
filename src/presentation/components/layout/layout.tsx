import { Box, Flex, Text, useColorModeValue, chakra, useToast, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { HiHome, HiCommandLine, HiMagnifyingGlass } from 'react-icons/hi2';
import { RiPlayListFill, RiSlashCommands2 } from 'react-icons/ri';
import { FaSpotify, FaDiscord } from 'react-icons/fa';
import { Outlet, useLocation } from 'react-router';
import { ThemeSwitcher, currentAccountState } from '@/presentation/components';
import Logo from '../logo/logo';
import { NavItem, UserMenu, Player, playerState } from './components';
import { LoadMusic, LoadQueue, LoadUser, RunCommand, SpotifyAuthorize, DiscordAuthorize } from '@/domain/usecases';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useErrorHandler } from '@/presentation/hooks';
import { AccessTokenExpiredError } from '@/domain/errors';
import { Socket } from 'socket.io-client';

const HomeIcon = chakra(HiHome);
const CommandsIcon = chakra(HiCommandLine);
const SpotifyIcon = chakra(FaSpotify);
const BrowseIcon = chakra(HiMagnifyingGlass);
const PlaylistIcon = chakra(RiPlayListFill);
const DiscordIcon = chakra(FaDiscord);
const DiscordCommandsIcon = chakra(RiSlashCommands2);

type Props = {
  loadUser: LoadUser;
  spotifyAuthorize: SpotifyAuthorize;
  loadMusic: LoadMusic;
  runCommand: RunCommand;
  loadQueue: LoadQueue;
  socketClient: Socket;
  discordAuthorize: DiscordAuthorize;
};

export default function Layout({
  loadUser,
  spotifyAuthorize,
  loadMusic,
  runCommand,
  loadQueue,
  socketClient,
  discordAuthorize
}: Props): JSX.Element {
  const sidebarColor = useColorModeValue('gray.100', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [navSize, setNavSize] = useState<string>('large');
  const location = useLocation();
  const { setCurrentAccount, getCurrentAccount } = useRecoilValue(currentAccountState);
  // eslint-disable-next-line
  const [state, setState] = useRecoilState(playerState);
  const toast = useToast();
  // eslint-disable-next-line n/handle-callback-err
  const handleError = useErrorHandler((error: Error) => {});

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

  const fetchMusic = async (): Promise<void> => {
    const music = await loadMusic.load();
    if (music) {
      setState(prev => ({
        ...prev,
        music
      }));
    }
  };

  const fetchQueue = async (): Promise<void> => {
    const queue = await loadQueue.all();
    if (queue.length) {
      setState(prev => ({
        ...prev,
        queue
      }));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchMusic();
        await fetchQueue();
      } catch (error: any) {
        if (error instanceof AccessTokenExpiredError) {
          toast({
            title: 'Access Denied',
            description: 'Your login with spotify is either expired or invalid, please log in with spotify again!',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        } else {
          toast({
            title: 'Server Error',
            description: 'Something went wrong while trying to load music',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        }
        handleError(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const currentAccount = getCurrentAccount();
      if (currentAccount.user.spotify?.accessToken && !currentAccount.user.spotify?.avatarUrl) {
        const spotifyUser = await loadUser.load();
        setCurrentAccount({
          ...currentAccount,
          user: {
            ...currentAccount.user,
            spotify: { ...currentAccount.user.spotify, avatarUrl: spotifyUser.images[0].url }
          }
        });
        window.location.reload();
      }
    })();
  }, [getCurrentAccount().user.spotify?.accessToken]);

  const currentRoute = useMemo(() => {
    const pathname = location.pathname.split('/');

    /* istanbul ignore next -- @preserve */
    if (pathname.length === 3 && !/\d/.test(pathname[2])) {
      /* istanbul ignore next -- @preserve */
      return `/${pathname[1]}/${pathname[2]}`;
    }
    return `/${pathname[1]}`;
  }, [location]);

  const toggleSidebar = (): void => {
    if (navSize === 'small') {
      setNavSize('large');
    } else {
      setNavSize('small');
    }
  };

  const onSpotifySignUp = async (): Promise<void> => {
    const url = await spotifyAuthorize.authorize();
    window.location.href = url;
  };

  const onDiscordLink = async (): Promise<void> => {
    const url = await discordAuthorize.authorize();
    window.location.href = url;
  };

  const onResume = async (): Promise<void> => {
    try {
      await runCommand.run('resume');
      toast({
        title: 'Song Resumed',
        description: 'Your song was successfully resumed',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Resume Error',
        description: 'There was an error while trying to resume',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const onPause = async (): Promise<void> => {
    try {
      await runCommand.run('pause');
      toast({
        title: 'Song Paused',
        description: 'Your song was successfully paused',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Pause Error',
        description: 'There was an error while trying to pause',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const onShuffle = async (): Promise<void> => {
    try {
      await runCommand.run('shuffle');
      toast({
        title: 'Queue Shuffled',
        description: 'Your queue was successfully shuffled',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
      setTimeout(() => {
        fetchQueue();
      }, 1500);
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Shuffle Error',
        description: 'There was an error while trying to shuffle',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const onSkip = async (index?: number): Promise<void> => {
    try {
      await runCommand.run(index ? `skip ${index}` : 'skip');
      toast({
        title: 'Song Skipped',
        description: 'Your song was successfully skipped',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Skip Error',
        description: 'There was an error while trying to skip',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const onVolumeChange = async (volume: number): Promise<void> => {
    try {
      await runCommand.run(`setVolume ${volume}`);
      toast({
        title: 'Song Volume',
        description: 'The song volume was successfully changed',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Song Volume',
        description: 'There was an error while trying to change the song volume',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  const onRemove = async (index: number): Promise<void> => {
    try {
      await runCommand.run(`remove ${index}`);
      toast({
        title: 'Song Removed',
        description: 'Your song was successfully removed from queue',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Remove Error',
        description: 'There was an error while trying to remove song from queue',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  // Ignore coverage because it's a drag event and we can't test it
  /* istanbul ignore next -- @preserve */
  const onMove = async (from: number, to: number): Promise<void> => {
    try {
      await runCommand.run(`move ${from} ${to}`);
    } catch (error: any) {
      handleError(error);
      toast({
        title: 'Move Error',
        description: 'There was an error while trying to move',
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    }
  };

  useEffect(() => {
    function onMusicChange(value: any): void {
      setState(prev => ({
        ...prev,
        music: value
      }));
      fetchMusic();
      fetchQueue();
    }

    socketClient.on('music', onMusicChange);

    return () => {
      socketClient.off('music', onMusicChange);
    };
  }, []);

  return (
    <Grid h="100vh" w="100vw" templateRows="repeat(8, 1fr)" templateColumns="repeat(12, 1fr)">
      <GridItem
        data-testid="nav-flex"
        data-status={navSize === 'small' ? 'small' : 'large'}
        bgColor={sidebarColor}
        borderBottomWidth={1.5}
        borderBottomColor={borderColor}
        rowSpan={7}
        colSpan={navSize === 'small' ? 1 : [6, 5, 5, 3, 3, 2]}
      >
        <Flex p="1%" flexDir="column" alignItems={navSize === 'small' ? 'center' : 'flex-start'} as="nav">
          <Box p={2} display="flex" alignItems="center">
            <Logo data-testid="bot-logo" onClick={toggleSidebar} width="82px" height="82px" />
            {navSize !== 'small' && (
              <Flex flexDir="column">
                <Text
                  data-testid="bot-name"
                  fontSize="4xl"
                  fontWeight={700}
                  color="green"
                  onClick={toggleSidebar}
                  display={['none', 'flex']}
                >
                  {process.env.VITE_BOT_NAME}
                </Text>
                <ThemeSwitcher />
              </Flex>
            )}
          </Box>
          <NavItem testName="home" currentRoute={currentRoute} to="/" title="Home" icon={HomeIcon} navSize={navSize} />
          <NavItem
            testName="commands"
            currentRoute={currentRoute}
            to="/commands"
            title="Commands"
            icon={CommandsIcon}
            navSize={navSize}
          />
          <NavItem
            testName="spotify"
            currentRoute={currentRoute}
            title="Spotify"
            to=""
            icon={SpotifyIcon}
            navSize={navSize}
            subItems={[
              {
                id: 'playlists',
                title: 'Playlists',
                icon: PlaylistIcon,
                to: '/playlists'
              },
              {
                id: 'browse',
                title: 'Browse',
                icon: BrowseIcon,
                to: '/browse'
              }
            ]}
          />
          <NavItem
            testName="discord"
            currentRoute={currentRoute}
            title="Discord"
            to=""
            icon={DiscordIcon}
            navSize={navSize}
            subItems={[{ id: 'discord-commands', title: 'Commands', icon: DiscordCommandsIcon, to: '/discord/commands' }]}
          />
        </Flex>
      </GridItem>

      <GridItem
        borderLeftWidth={1.5}
        borderLeftColor={borderColor}
        borderBottomWidth={1.5}
        borderBottomColor={borderColor}
        rowSpan={7}
        colSpan={navSize === 'small' ? 11 : [6, 7, 7, 9, 9, 10]}
        overflowY="auto"
        p={8}
        data-testid="page-outlet"
        position="relative"
        overflowX="hidden"
      >
        <UserMenu onSpotifySignUp={onSpotifySignUp} onDiscordLink={onDiscordLink} />
        <Outlet />
      </GridItem>

      <GridItem rowSpan={1} colSpan={12} display="flex" justifyContent="center" alignItems="center">
        <Player
          onResume={onResume}
          onPause={onPause}
          onShuffle={onShuffle}
          onSkip={onSkip}
          onVolumeChange={onVolumeChange}
          onRemove={onRemove}
          onMove={onMove}
        />
      </GridItem>
    </Grid>
  );
}
