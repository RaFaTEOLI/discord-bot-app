import { Login } from '@/presentation/pages';
import {
  makeRemoteAuthentication,
  makeRemoteSpotifyAuthorize,
  makeRemoteSpotifyRequestToken
} from '@/main/factories/usecases';

export const LoginFactory = (): JSX.Element => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      spotifyAuthorize={makeRemoteSpotifyAuthorize()}
      spotifyRequestToken={makeRemoteSpotifyRequestToken()}
    />
  );
};
