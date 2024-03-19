import { LoadDiscordCommands } from '@/domain/usecases';
import { Content, Error, Loading } from '@/presentation/components';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { discordCommandsState } from './components';
import { Box, Flex } from '@chakra-ui/react';
import CommandListItem from './components/command-list-item';

type Props = {
  loadDiscordCommands: LoadDiscordCommands;
};

export default function Commands({ loadDiscordCommands }: Props): JSX.Element {
  const [state, setState] = useRecoilState(discordCommandsState);

  const reload = (): void => setState(prev => ({ ...prev, commands: [], error: '', reload: !prev.reload }));
  useEffect(() => {
    (async () => {
      try {
        const commands = await loadDiscordCommands.all();
        setState(prev => ({ ...prev, commands, error: '', reload: false }));
      } catch (err: any) {
        setState(prev => ({ ...prev, error: err.message }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    })();
  }, [loadDiscordCommands, state.reload]);

  return (
    <Content title="Commands">
      {state.isLoading ? (
        <Flex w="full" justifyContent="center" alignItems="center">
          <Loading />
        </Flex>
      ) : (
        <>
          {state.error ? (
            <Flex justifyContent="center" alignItems="center">
              <Box w="md">
                <Error error={state.error} reload={reload} />
              </Box>
            </Flex>
          ) : (
            <CommandListItem commands={state.commands} />
          )}
        </>
      )}
    </Content>
  );
}
