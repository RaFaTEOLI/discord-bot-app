import { DiscordAuthorize } from '@/domain/usecases';

export const makeDiscordSettingsFactory = (
  redirectUri = process.env.VITE_DISCORD_REDIRECT_URI as string
): DiscordAuthorize.Params => ({
  responseType: 'code',
  clientId: process.env.VITE_DISCORD_CLIENT_ID as string,
  redirectUri,
  scope: 'email identify'
});
