import { RemoteDiscordLoadUser } from '@/data/usecases';
import { makeAxiosHttpClient } from '@/main/factories/http';
import { DiscordLoadUser } from '@/domain/usecases';

export const makeRemoteDiscordLoadUser = (): DiscordLoadUser => {
  return new RemoteDiscordLoadUser(`${process.env.VITE_DISCORD_API_URL as string}/@me`, makeAxiosHttpClient());
};
