import { makeRemoteLoadUserById, makeRemoteRunCommand } from '@/main/factories/usecases';
import { makeRemoteLoadPlaylistTracks } from '@/main/factories/usecases/load-playlist-tracks/remote-playlist-tracks-factory';
import { Playlist } from '@/presentation/pages';

export const PlaylistFactory = (): JSX.Element => {
  return (
    <Playlist
      loadPlaylistTracks={makeRemoteLoadPlaylistTracks()}
      runCommand={makeRemoteRunCommand()}
      loadUserById={makeRemoteLoadUserById()}
    />
  );
};
