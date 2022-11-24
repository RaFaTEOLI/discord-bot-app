import { LoadMusic } from '@/domain/usecases';
import { makeApiUrl, makeSpotifyApiUrl } from '@/main/factories/http';
import { RemoteLoadMusic } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadMusic = (): LoadMusic => {
  return new RemoteLoadMusic(
    makeApiUrl('/music'),
    makeAuthorizeHttpClientDecorator(),
    makeSpotifyApiUrl('/search'),
    makeAuthorizeHttpClientDecorator()
  );
};
