import { SpotifyContainer } from '@/presentation/components';
import { makeRemoteSpotifyRequestToken } from '@/main/factories/usecases';

export const SpotifyContainerFactory = (): JSX.Element => {
  return <SpotifyContainer spotifyRequestToken={makeRemoteSpotifyRequestToken()} />;
};
