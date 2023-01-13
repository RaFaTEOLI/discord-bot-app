import { LoadUserById } from '@/domain/usecases';
import { makeSpotifyApiUrl } from '@/main/factories/http';
import { RemoteLoadUserById } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadUserById = (): LoadUserById => {
  return new RemoteLoadUserById(makeSpotifyApiUrl('/users'), makeAuthorizeHttpClientDecorator());
};
