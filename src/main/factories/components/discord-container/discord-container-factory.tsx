import { DiscordContainer } from '@/presentation/components';
import { makeRemoteDiscordAuthenticate } from '@/main/factories/usecases';

export const DiscordContainerFactory = (): JSX.Element => {
  return (
    <DiscordContainer discordAuthenticate={makeRemoteDiscordAuthenticate(process.env.VITE_DISCORD_REDIRECT_URI as string)} />
  );
};
