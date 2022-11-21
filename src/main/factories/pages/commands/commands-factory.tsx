import { Commands } from '@/presentation/pages';
import { makeRemoteLoadCommands, makeRemoteSaveCommand } from '@/main/factories/usecases';

export const CommandsFactory = (): JSX.Element => {
  return <Commands loadCommands={makeRemoteLoadCommands()} saveCommand={makeRemoteSaveCommand()} />;
};
