import { useLogout } from '@/presentation/hooks';
import { AccessDeniedError, AccessTokenExpiredError } from '@/domain/errors';
import { useRecoilValue } from 'recoil';
import { currentAccountState } from '../components';
import { SpotifyRefreshToken } from '@/domain/usecases';

type CallbackType = (error: Error) => void;
type ResultType = CallbackType;

export const useErrorHandler = (callback: CallbackType, spotifyRefreshToken?: SpotifyRefreshToken): ResultType => {
  const { getCurrentAccount, setCurrentAccount } = useRecoilValue(currentAccountState);
  const logout = useLogout();
  return async (error: Error): Promise<void> => {
    if (error instanceof AccessTokenExpiredError && spotifyRefreshToken && getCurrentAccount().user.spotify?.refreshToken) {
      try {
        const newSpotifyToken = await spotifyRefreshToken.refresh({
          refreshToken: getCurrentAccount().user.spotify?.refreshToken ?? ''
        });

        if (newSpotifyToken.accessToken) {
          setCurrentAccount({
            ...getCurrentAccount(),
            user: {
              ...getCurrentAccount().user,
              spotify: { ...getCurrentAccount().user.spotify, accessToken: newSpotifyToken.accessToken, refreshToken: '' }
            }
          });
        }
        window.location.reload();
        return;
      } catch (err) {
        callback(error);
      }
    }

    if (error instanceof AccessDeniedError || error instanceof AccessTokenExpiredError) {
      logout();
    } else {
      callback(error);
    }
  };
};
