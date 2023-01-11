import { LoadPlaylistTracks } from '@/domain/usecases';
import { makeSpotifyApiUrl } from '@/main/factories/http';
import { RemoteLoadPlaylistTracks } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadPlaylistTracks = (): LoadPlaylistTracks => {
  return new RemoteLoadPlaylistTracks(
    makeSpotifyApiUrl('/playlists'),
    makeAuthorizeHttpClientDecorator(),
    makeAuthorizeHttpClientDecorator()
  );
};
