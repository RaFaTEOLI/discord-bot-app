import { RunCommand } from '@/domain/usecases';
import { RemoteRunCommand } from '@/data/usecases';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeRemoteRunCommand = (): RunCommand => {
  return new RemoteRunCommand(
    process.env.VITE_BOT_WEBHOOK as string,
    makeAxiosHttpClient(),
    process.env.VITE_BOT_NAME as string
  );
};
