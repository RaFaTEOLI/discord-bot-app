import { DiscordAuthorize } from '@/domain/usecases';
import { RemoteDiscordAuthorize } from '@/data/usecases';

export const makeRemoteDiscordAuthorize = (redirectUri: string): DiscordAuthorize => {
  return new RemoteDiscordAuthorize(process.env.VITE_DISCORD_AUTHORIZE_URL as string, {
    responseType: 'code',
    clientId: process.env.VITE_DISCORD_CLIENT_ID as string,
    redirectUri,
    scope: 'email identify'
  });
};
