import { SpotifyContainer } from '@/presentation/components';
import { makeRemoteSpotifyRequestToken } from '@/main/factories/usecases';

export const SpotifyContainerFactory = (): JSX.Element => {
  return (
    <SpotifyContainer
      spotifyRequestTokenLogin={makeRemoteSpotifyRequestToken(process.env.VITE_SPOTIFY_LOGIN_REDIRECT_URI as string)}
      spotifyRequestTokenSignUp={makeRemoteSpotifyRequestToken(process.env.VITE_SPOTIFY_SIGNUP_REDIRECT_URI as string)}
    />
  );
};
