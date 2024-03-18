import { LoadDiscordCommands } from '@/domain/usecases';
import { makeDiscordApplicationApiUrl } from '@/main/factories/http';
import { RemoteLoadDiscordCommands } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadDiscordCommands = (): LoadDiscordCommands => {
  return new RemoteLoadDiscordCommands(makeDiscordApplicationApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
