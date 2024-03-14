import { LoadDiscordCommands } from '@/domain/usecases';
import { Content } from '@/presentation/components';
import { useEffect } from 'react';

type Props = {
  loadDiscordCommands: LoadDiscordCommands;
};

export default function Commands({ loadDiscordCommands }: Props): JSX.Element {
  useEffect(() => {
    (async () => {
      await loadDiscordCommands.all();
    })();
  }, [loadDiscordCommands]);

  return (
    <Content title="Commands">
      <p>Commands Page</p>
    </Content>
  );
}
