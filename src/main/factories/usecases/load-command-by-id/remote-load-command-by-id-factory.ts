import { LoadCommandById } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteLoadCommandById } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadCommandById = (): LoadCommandById => {
  return new RemoteLoadCommandById(makeApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
