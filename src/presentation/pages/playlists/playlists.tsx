import { LoadUserPlaylists } from '@/domain/usecases';
import { Heading } from '@chakra-ui/react';
import { useEffect } from 'react';

type Props = {
  loadUserPlaylists: LoadUserPlaylists;
};

export default function Playlists({ loadUserPlaylists }: Props): JSX.Element {
  useEffect(() => {
    (async () => {
      await loadUserPlaylists.all();
    })();
  }, []);

  return <Heading>Playlists</Heading>;
}
