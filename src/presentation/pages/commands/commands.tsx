import { Content, currentAccountState, Error, Loading } from '@/presentation/components';
import { Flex, Box, Button, useDisclosure, useToast } from '@chakra-ui/react';
import { commandsState, CommandListItem, CommandModal } from './components';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { CommandModel } from '@/domain/models';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { LoadCommands, SaveCommand } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  loadCommands: LoadCommands;
  saveCommand: SaveCommand;
};

const schema = yupResolver(
  yup
    .object()
    .shape({
      command: yup.string().required('Required field'),
      description: yup.string().required('Required field'),
      dispatcher: yup.string().required('Required field'),
      type: yup.string().required('Required field'),
      response: yup.string()
    })
    .required()
);

export default function Commands({ loadCommands, saveCommand }: Props): JSX.Element {
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
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CommandModel>({
    defaultValues: state.selectedCommand,
    resolver: schema
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

  useEffect(() => {
    setState(prev => ({
      ...prev,
      register,
      errors
    }));
  }, [register, errors, state.selectedCommand]);

  const handleClose = (): void => {
    setState(prev => ({
      ...prev,
      selectedCommand: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' }
    }));
    onClose();
    reset();
  };

  const onSubmit = handleSubmit(async data => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { id, ...dataValues } = data;
      const params = state.selectedCommand.id ? Object.assign({}, dataValues, { id: state.selectedCommand.id }) : dataValues;
      await saveCommand.save(params);
      setState(prev => ({ ...prev, isLoading: false }));
      onClose();
      toast({
        title: 'Saved Command',
        description: 'Your command was successfully saved',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    } catch (error: any) {
      handleError(error);
    }
  });

  return (
    <>
      <Content title="Commands">
        {state.isLoading ? (
          <Flex alignItems="center" justifyContent="center">
            <Loading />
          </Flex>
        ) : (
          <Flex flexDir="column">
            {getCurrentAccount().user.role === 'admin' && (
              <Flex justifyContent="flex-end" p={5}>
                <Button
                  data-testid="new-command"
                  onClick={onOpen}
                  leftIcon={<HiOutlinePlusCircle />}
                  colorScheme="blue"
                  size="sm"
                >
                  Add
                </Button>
              </Flex>
            )}

            {state.error ? (
              <Flex justifyContent="center" alignItems="center">
                <Box w="md">
                  <Error error={state.error} reload={reload} />
                </Box>
              </Flex>
            ) : (
              <CommandListItem handleView={handleView} commands={state.commands} />
            )}
          </Flex>
        )}
      </Content>
      <CommandModal onSubmit={onSubmit} isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
