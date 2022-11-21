import { Commands } from '@/presentation/pages';
import { makeRemoteLoadCommands } from '@/main/factories/usecases';

export const CommandsFactory = (): JSX.Element => {
  return <Commands loadCommands={makeRemoteLoadCommands()} />;
};
