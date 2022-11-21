import { Content, Error, Loading } from '@/presentation/components';
import { Flex, Box, Button, useDisclosure } from '@chakra-ui/react';
import { commandsState, CommandListItem, CommandModal } from './components';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { CommandModel } from '@/domain/models';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { LoadCommands } from '@/domain/usecases';
import { useEffect } from 'react';
import { useErrorHandler } from '@/presentation/hooks';

type Props = {
  loadCommands: LoadCommands;
};

export default function Commands({ loadCommands }: Props): JSX.Element {
  const resetCommandsState = useResetRecoilState(commandsState);
  const [state, setState] = useRecoilState(commandsState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, isLoading: false, error: error.message, reload: false }));
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

  const onSubmit = async (data: any): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
    } catch (error: any) {
      handleError(error);
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
      <CommandModal onSubmit={onSubmit} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
