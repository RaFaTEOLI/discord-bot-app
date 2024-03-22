import { LoadDiscordCommands } from '@/domain/usecases';
import { RemoteLoadDiscordCommands } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export const makeRemoteLoadDiscordCommands = (): LoadDiscordCommands => {
  return new RemoteLoadDiscordCommands(makeApiUrl('/discord/commands'), makeAuthorizeHttpClientDecorator());
};
