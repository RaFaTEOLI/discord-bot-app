import { Playlists } from '@/presentation/pages';
import { makeRemoteLoadUserPlaylists } from '@/main/factories/usecases';

export const PlaylistsFactory = (): JSX.Element => {
  return <Playlists loadUserPlaylists={makeRemoteLoadUserPlaylists()} />;
};
