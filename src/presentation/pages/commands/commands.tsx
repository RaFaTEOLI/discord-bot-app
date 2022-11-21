import { Content, Error, Loading } from '@/presentation/components';
import { Flex, Button, useDisclosure } from '@chakra-ui/react';
import { commandsState, CommandListItem, CommandModal } from './components';
import { useRecoilState } from 'recoil';
import { CommandModel } from '@/domain/models';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import { LoadCommands } from '@/domain/usecases';

type Props = {
  loadCommands: LoadCommands;
};

export default function Commands({ loadCommands }: Props): JSX.Element {
  const [state, setState] = useRecoilState(commandsState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleView = (command: CommandModel): void => {
    setState(prev => ({ ...prev, selectedCommand: command }));
    onOpen();
  };

  const onSubmit = async (data: any): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
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
              <Error error={state.error} reload={() => {}} />
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
