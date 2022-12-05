import { LoadQueue } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteLoadQueue } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadQueue = (): LoadQueue => {
  return new RemoteLoadQueue(makeApiUrl('/queue'), makeAuthorizeHttpClientDecorator());
};
