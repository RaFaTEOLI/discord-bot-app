import { LoadDiscordCommands } from '@/domain/usecases';
import { Content, Loading } from '@/presentation/components';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { discordCommandsState } from './components';
import { Flex } from '@chakra-ui/react';

type Props = {
  loadDiscordCommands: LoadDiscordCommands;
};

export default function Commands({ loadDiscordCommands }: Props): JSX.Element {
  const [state, setState] = useRecoilState(discordCommandsState);

  useEffect(() => {
    (async () => {
      const response = await loadDiscordCommands.all();
      setState({ commands: response, isLoading: false });
    })();
  }, [loadDiscordCommands]);

  return (
    <Content title="Commands">
      {state.isLoading ? (
        <Flex w="full" justifyContent="center" alignItems="center">
          <Loading />
        </Flex>
      ) : (
        <>
          <p>Commands Page</p>
          <div data-testid="discord-commands">
            {state.commands.map(command => (
              <div key={command.id} className="command">
                {command.name}
              </div>
            ))}
          </div>
        </>
      )}
    </Content>
  );
}
