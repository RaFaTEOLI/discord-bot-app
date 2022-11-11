import { SpotifyRequestToken } from '@/domain/usecases';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { currentAccountState } from '@/presentation/components';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

type Props = {
  spotifyRequestToken: SpotifyRequestToken;
};

export default function SpotifyContainer({ spotifyRequestToken }: Props): JSX.Element {
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
      if (code && spotifyState) {
        try {
          const spotifyAccess = await spotifyRequestToken.request({ code, state: spotifyState });
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
