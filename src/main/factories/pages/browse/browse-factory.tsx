import { Browse } from '@/presentation/pages';
import { makeRemoteSpotifySearch } from '@/main/factories/usecases';

export const BrowseFactory = (): JSX.Element => {
  return <Browse spotifySearch={makeRemoteSpotifySearch()} />;
};
