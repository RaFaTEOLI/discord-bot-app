import { Profile } from '@/presentation/pages';
import { makeRemoteLoadUser, makeRemoteSpotifyRefreshToken } from '@/main/factories/usecases';

export const ProfileFactory = (): JSX.Element => {
  return <Profile loadUser={makeRemoteLoadUser()} refreshToken={makeRemoteSpotifyRefreshToken()} />;
};
