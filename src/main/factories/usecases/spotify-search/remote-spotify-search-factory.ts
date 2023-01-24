import { SpotifySearch } from '@/domain/usecases';
import { RemoteSpotifySearch } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { makeSpotifyApiUrl } from '@/main/factories/http';

export const makeRemoteSpotifySearch = (): SpotifySearch => {
  return new RemoteSpotifySearch(makeSpotifyApiUrl('/search'), makeAuthorizeHttpClientDecorator());
};
