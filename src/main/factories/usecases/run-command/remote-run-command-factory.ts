import { RunCommand } from '@/domain/usecases';
import { RemoteRunCommand } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteRunCommand = (): RunCommand => {
  return new RemoteRunCommand(
    process.env.VITE_BOT_WEBHOOK as string,
    makeAuthorizeHttpClientDecorator(),
    process.env.VITE_BOT_NAME as string
  );
};
