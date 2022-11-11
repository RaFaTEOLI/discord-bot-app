import { SpotifyContainer } from '@/presentation/components';
import { makeRemoteSpotifyAuthenticate } from '@/main/factories/usecases';

export const SpotifyContainerFactory = (): JSX.Element => {
  return (
    <SpotifyContainer
      spotifyAuthenticateLogin={makeRemoteSpotifyAuthenticate(process.env.VITE_SPOTIFY_LOGIN_REDIRECT_URI as string)}
      spotifyAuthenticateSignUp={makeRemoteSpotifyAuthenticate(process.env.VITE_SPOTIFY_SIGNUP_REDIRECT_URI as string)}
    />
  );
};
