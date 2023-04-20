import { SpotifyAuthenticate } from '@/domain/usecases';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { currentAccountState } from '@/presentation/components';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { AccountModel } from '@/domain/models';

type Props = {
  spotifyAuthenticateLogin: SpotifyAuthenticate;
  spotifyAuthenticateSignUp: SpotifyAuthenticate;
};

export default function SpotifyContainer({ spotifyAuthenticateLogin, spotifyAuthenticateSignUp }: Props): JSX.Element {
  const [searchParams] = useSearchParams();
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const currentRoute = useMemo(() => {
    const pathname = location.pathname.split('/');
    return pathname[1];
  }, [location]);

  useEffect(() => {
    (async () => {
      const code = searchParams.get('code');
      const spotifyState = searchParams.get('state');
      if (code) {
        try {
          let spotifyAccess: AccountModel;
          if (currentRoute === 'signup') {
            spotifyAccess = await spotifyAuthenticateSignUp.request({ code, state: spotifyState });
          } else {
            spotifyAccess = await spotifyAuthenticateLogin.request({ code, state: spotifyState });
          }

          setCurrentAccount(spotifyAccess);
          if (currentRoute === 'login' || currentRoute === 'signup') {
            navigate('/');
          }
        } catch (err) {
          toast({
            title: 'Login Error',
            description: 'There was an error while trying to login with Spotify.',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        }
      }
    })();
  }, []);

  return <Outlet />;
}
