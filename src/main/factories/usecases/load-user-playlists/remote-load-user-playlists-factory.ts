import { LoadUserPlaylists } from '@/domain/usecases';
import { makeSpotifyApiUrl } from '@/main/factories/http';
import { RemoteLoadUserPlaylists } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadUserPlaylists = (): LoadUserPlaylists => {
  return new RemoteLoadUserPlaylists(makeSpotifyApiUrl('/me/playlists?limit=50'), makeAuthorizeHttpClientDecorator());
};
