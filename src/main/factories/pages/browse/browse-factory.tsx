import { Browse } from '@/presentation/pages';
import { makeRemoteRunCommand, makeRemoteSpotifySearch } from '@/main/factories/usecases';

export const BrowseFactory = (): JSX.Element => {
  return <Browse spotifySearch={makeRemoteSpotifySearch()} runCommand={makeRemoteRunCommand()} />;
};
