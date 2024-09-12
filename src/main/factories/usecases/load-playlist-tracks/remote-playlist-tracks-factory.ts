import { LoadPlaylistTracks } from '@/domain/usecases';
import { makeSpotifyApiUrl } from '@/main/factories/http';
import { RemoteLoadPlaylistTracks } from '@/data/usecases';
import { makeSpotifyHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadPlaylistTracks = (): LoadPlaylistTracks => {
  return new RemoteLoadPlaylistTracks(
    makeSpotifyApiUrl('/playlists'),
    makeSpotifyHttpClientDecorator(),
    makeSpotifyHttpClientDecorator()
  );
};
