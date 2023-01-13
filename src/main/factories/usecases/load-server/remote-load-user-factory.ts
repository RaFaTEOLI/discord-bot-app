import { LoadServer } from '@/domain/usecases';
import { RemoteLoadServer } from '@/data/usecases';
import { makeAxiosHttpClient } from '@/main/factories/http';

export const makeRemoteLoadServer = (): LoadServer => {
  return new RemoteLoadServer(
    `https://discord.com/api/guilds/${process.env.VITE_SERVER_ID as string}/widget.json`,
    makeAxiosHttpClient()
  );
};
