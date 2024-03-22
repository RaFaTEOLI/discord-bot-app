import { makeRemoteLoadDiscordCommands } from '@/main/factories/usecases';
import { DiscordCommands } from '@/presentation/pages';

export const DiscordCommandsFactory = (): JSX.Element => {
  return <DiscordCommands loadDiscordCommands={makeRemoteLoadDiscordCommands()} />;
};
