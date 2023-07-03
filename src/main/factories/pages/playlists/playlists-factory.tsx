import { Playlists } from '@/presentation/pages';
import { makeRemoteLoadUserPlaylists, makeRemoteRunCommand, makeRemoteSpotifyRefreshToken } from '@/main/factories/usecases';

export const PlaylistsFactory = (): JSX.Element => {
  return (
    <Playlists
      loadUserPlaylists={makeRemoteLoadUserPlaylists()}
      runCommand={makeRemoteRunCommand()}
      refreshToken={makeRemoteSpotifyRefreshToken()}
    />
  );
};
