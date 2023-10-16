import { Commands } from '@/presentation/pages';
import { makeRemoteLoadCommands, makeRemoteDeleteCommand, makeRemoteRunCommand } from '@/main/factories/usecases';

export const CommandsFactory = (): JSX.Element => {
  return (
    <Commands
      loadCommands={makeRemoteLoadCommands()}
      deleteCommand={makeRemoteDeleteCommand()}
      runCommand={makeRemoteRunCommand()}
    />
  );
};
