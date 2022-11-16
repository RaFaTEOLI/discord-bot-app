import { LoadUser } from '@/domain/usecases';
import { makeSpotifyApiUrl } from '@/main/factories/http';
import { RemoteLoadUser } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadUser = (): LoadUser => {
  return new RemoteLoadUser(makeSpotifyApiUrl('/me'), makeAuthorizeHttpClientDecorator());
};
