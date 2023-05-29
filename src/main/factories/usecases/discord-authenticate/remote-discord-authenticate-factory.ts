import { RemoteDiscordAuthenticate } from '@/data/usecases';
import { makeAxiosHttpClient, makeDiscordSettingsFactory } from '@/main/factories/http';
import { DiscordAuthenticate } from '@/domain/usecases';

export const makeRemoteDiscordAuthenticate = (redirectUri: string): DiscordAuthenticate => {
  return new RemoteDiscordAuthenticate(
    `${process.env.VITE_DISCORD_API_URL as string}/token`,
    makeDiscordSettingsFactory(redirectUri),
    process.env.VITE_DISCORD_CLIENT_SECRET as string,
    makeAxiosHttpClient()
  );
};
