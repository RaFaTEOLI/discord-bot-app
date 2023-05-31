import { DiscordAuthenticate, DiscordLoadUser, SaveUser } from '@/domain/usecases';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { currentAccountState } from '@/presentation/components';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { InvalidCredentialsError } from '@/domain/errors';

type Props = {
  discordAuthenticate: DiscordAuthenticate;
  discordLoadUser: DiscordLoadUser;
  saveUser: SaveUser;
};

export default function DiscordContainer({ discordAuthenticate, discordLoadUser, saveUser }: Props): JSX.Element {
  const [searchParams] = useSearchParams();
  const { setCurrentAccount, getCurrentAccount } = useRecoilValue(currentAccountState);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const code = searchParams.get('code');
      if (code) {
        try {
          const discordAccess = await discordAuthenticate.request({ code });
          const discordUser = await discordLoadUser.load(discordAccess.access_token);

          const currentAccount = getCurrentAccount();
          currentAccount.user.discord = {
            id: discordUser.user.id,
            username: discordUser.user.username,
            avatar: discordUser.user.avatar,
            discriminator: discordUser.user.discriminator
          };

          setCurrentAccount(currentAccount);

          await saveUser.save({
            discord: currentAccount.user.discord
          });

          navigate('/');
        } catch (err) {
          if (err instanceof InvalidCredentialsError) {
            toast({
              title: 'Login Error',
              description: 'Your credentials are invalid.',
              status: 'error',
              duration: 9000,
              isClosable: true
            });
          } else {
            toast({
              title: 'Login Error',
              description: 'There was an error while trying to login with Discord.',
              status: 'error',
              duration: 9000,
              isClosable: true
            });
          }
        }
      }
    })();
  }, []);

  return <Outlet />;
}
