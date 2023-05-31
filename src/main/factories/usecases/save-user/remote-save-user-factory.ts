import { SaveUser } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteSaveUser } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteSaveUser = (): SaveUser => {
  return new RemoteSaveUser(makeApiUrl('/account'), makeAuthorizeHttpClientDecorator());
};
