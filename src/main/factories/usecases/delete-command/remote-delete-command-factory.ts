import { DeleteCommand } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteDeleteCommand } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteDeleteCommand = (): DeleteCommand => {
  return new RemoteDeleteCommand(makeApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
