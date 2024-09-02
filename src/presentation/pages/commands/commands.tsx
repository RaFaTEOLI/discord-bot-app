import { Content, currentAccountState, Error, Loading } from '@/presentation/components';
import { Flex, Box, Button, useDisclosure, useToast } from '@chakra-ui/react';
import { commandsState, CommandListItem, CommandModal, InputFilter } from './components';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { ApplicationCommandType, CommandModel } from '@/domain/models';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { DeleteCommand, LoadCommands, RunCommand } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

type Props = {
  loadCommands: LoadCommands;
  deleteCommand: DeleteCommand;
  runCommand: RunCommand;
};

export default function Commands({ loadCommands, deleteCommand, runCommand }: Props): JSX.Element {
  const navigate = useNavigate();
  const { getCurrentAccount } = useRecoilValue(currentAccountState);
  const resetCommandsState = useResetRecoilState(commandsState);
  const [state, setState] = useRecoilState(commandsState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message, reload: false }));
    onClose();
  });

  const toast = useToast();

  const {
    control,
    register,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CommandModel>({
    defaultValues: state.selectedCommand
  });

  const handleView = (command: CommandModel): void => {
    setState(prev => ({ ...prev, selectedCommand: command }));
    onOpen();
  };

  const reload = (): void => setState(prev => ({ ...prev, commands: [], error: '', reload: !prev.reload }));

  useEffect(() => resetCommandsState(), []);
  useEffect(() => {
    (async () => {
      try {
        const commands = await loadCommands.all();
        setState(prev => ({ ...prev, isLoading: false, commands, reload: false }));
      } catch (error: any) {
        handleError(error);
      }
    })();
  }, [state.reload]);

  useEffect(() => {
    const { command, description, response, type, dispatcher } = state.selectedCommand;

    setValue('command', command);
    setValue('description', description);
    setValue('response', response);
    setValue('type', type);
    setValue('dispatcher', dispatcher);

    if (type === 'action') {
      setState(prev => ({ ...prev, disabledForm: true }));
    } else {
      setState(prev => ({ ...prev, disabledForm: false }));
    }
  }, [state.selectedCommand]);

  const handleClose = (): void => {
    setState(prev => ({
      ...prev,
      selectedCommand: {
        id: '',
        command: '',
        description: '',
        type: '',
        dispatcher: '',
        response: '',
        discordType: ApplicationCommandType.CHAT_INPUT
      }
    }));
    onClose();
    reset();
  };

  const onDelete = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await deleteCommand.delete(state.selectedCommand.id);
      setState(prev => ({ ...prev, reload: true }));
      onClose();
      toast({
        title: 'Deleted Command',
        description: 'Your command was successfully deleted',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleRun = async (command: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await runCommand.run(command);
      toast({
        title: 'Run Command',
        description: 'Your command was successfully run',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } catch (error: any) {
      toast({
        title: 'Run Command',
        description: 'There was an error while trying to run your command!',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <>
      <Content title="Commands">
        {state.isLoading ? (
          <Flex alignItems="center" justifyContent="center">
            <Loading />
          </Flex>
        ) : (
          <Flex flexDir="column">
            <Flex justifyContent="space-between" p={0} pb={5}>
              <InputFilter borderRightRadius={getCurrentAccount().user.role === 'admin' ? 0 : 5} />
              {getCurrentAccount().user.role === 'admin' && (
                <Button
                  data-testid="new-command"
                  onClick={() => navigate('/commands/new')}
                  leftIcon={<HiOutlinePlusCircle />}
                  borderLeftRadius={0}
                  colorScheme="blue"
                  size="sm"
                >
                  Add
                </Button>
              )}
            </Flex>

            {state.error ? (
              <Flex justifyContent="center" alignItems="center">
                <Box w="md">
                  <Error error={state.error} reload={reload} />
                </Box>
              </Flex>
            ) : (
              <CommandListItem handleView={handleView} handleRun={handleRun} commands={state.filteredCommands} />
            )}
          </Flex>
        )}
      </Content>
      <CommandModal
        isOpen={isOpen}
        onClose={handleClose}
        onDelete={onDelete}
        control={control}
        errors={errors}
        register={register}
      />
    </>
  );
}
