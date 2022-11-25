import { Layout } from '@/presentation/components';
import {
  makeRemoteLoadMusic,
  makeRemoteLoadUser,
  makeRemoteRunCommand,
  makeRemoteSpotifyAuthorize
} from '@/main/factories/usecases';

export const LayoutFactory = (): JSX.Element => {
  return (
    <Layout
      loadUser={makeRemoteLoadUser()}
      spotifyAuthorize={makeRemoteSpotifyAuthorize(process.env.VITE_SPOTIFY_LOGIN_REDIRECT_URI as string)}
      loadMusic={makeRemoteLoadMusic()}
      runCommand={makeRemoteRunCommand()}
    />
  );
};
