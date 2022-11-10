import { Login } from '@/presentation/pages';
import { makeRemoteAuthentication } from '@/main/factories/usecases';
import { makeRemoteSpotifyAuthorize } from '../../usecases/spotify-authorize/remote-spotify-authorize-factory';

export const LoginFactory = (): JSX.Element => {
  return <Login authentication={makeRemoteAuthentication()} spotifyAuthorize={makeRemoteSpotifyAuthorize()} />;
};
