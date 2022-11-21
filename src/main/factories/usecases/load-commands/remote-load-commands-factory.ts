import { LoadCommands } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteLoadCommands } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadCommands = (): LoadCommands => {
  return new RemoteLoadCommands(makeApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
