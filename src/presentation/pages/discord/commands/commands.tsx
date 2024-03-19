import { LoadDiscordCommands } from '@/domain/usecases';
import { Content } from '@/presentation/components';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { discordCommandsState } from './components';

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
    </Content>
  );
}
