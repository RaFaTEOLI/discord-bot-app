import { Browse } from '@/presentation/pages';
import { makeRemoteRunCommand, makeRemoteSpotifyRefreshToken, makeRemoteSpotifySearch } from '@/main/factories/usecases';

export const BrowseFactory = (): JSX.Element => {
  return (
    <Browse
      spotifySearch={makeRemoteSpotifySearch()}
      runCommand={makeRemoteRunCommand()}
      refreshToken={makeRemoteSpotifyRefreshToken()}
    />
  );
};
