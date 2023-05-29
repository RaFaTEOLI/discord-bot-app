import { Layout } from '@/presentation/components';
import {
  makeRemoteLoadMusic,
  makeRemoteLoadQueue,
  makeRemoteLoadUser,
  makeRemoteRunCommand,
  makeRemoteSpotifyAuthorize,
  makeRemoteDiscordAuthorize
} from '@/main/factories/usecases';
import { makeSocketClient } from '@/main/factories/http';

export const LayoutFactory = (): JSX.Element => {
  return (
    <Layout
      loadUser={makeRemoteLoadUser()}
      spotifyAuthorize={makeRemoteSpotifyAuthorize(process.env.VITE_SPOTIFY_LOGIN_REDIRECT_URI as string)}
      loadMusic={makeRemoteLoadMusic()}
      runCommand={makeRemoteRunCommand()}
      loadQueue={makeRemoteLoadQueue()}
      socketClient={makeSocketClient()}
      discordAuthorize={makeRemoteDiscordAuthorize(process.env.VITE_DISCORD_REDIRECT_URI as string)}
    />
  );
};
