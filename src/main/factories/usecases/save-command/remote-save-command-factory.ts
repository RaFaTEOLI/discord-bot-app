import { SaveCommand } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteSaveCommand } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteSaveCommand = (): SaveCommand => {
  return new RemoteSaveCommand(makeApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
