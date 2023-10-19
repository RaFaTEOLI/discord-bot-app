import { makeRemoteLoadCommandById, makeRemoteSaveCommand } from '@/main/factories/usecases';
import Command from '@/presentation/pages/commands/command/command';
import { useParams } from 'react-router';

export const CommandFactory = (): JSX.Element => {
  const { id } = useParams<string>();
  return (
    <Command commandId={id as string} loadCommandById={makeRemoteLoadCommandById()} saveCommand={makeRemoteSaveCommand()} />
  );
};
