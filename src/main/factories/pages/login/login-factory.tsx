import { Login } from '@/presentation/pages';
import { makeRemoteAuthentication, makeRemoteSpotifyAuthorize } from '@/main/factories/usecases';

export const LoginFactory = (): JSX.Element => {
  return <Login authentication={makeRemoteAuthentication()} spotifyAuthorize={makeRemoteSpotifyAuthorize()} />;
};
