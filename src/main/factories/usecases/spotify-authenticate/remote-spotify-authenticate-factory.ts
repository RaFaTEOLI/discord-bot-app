import { RemoteSpotifyAuthenticate } from '@/data/usecases';
import { makeApiUrl, makeAxiosHttpClient, makeSpotifySettingsFactory } from '@/main/factories/http';
import { SpotifyAuthenticate } from '@/domain/usecases';

export const makeRemoteSpotifyAuthenticate = (redirectUri: string): SpotifyAuthenticate => {
  return new RemoteSpotifyAuthenticate(
    makeApiUrl('/spotify/auth'),
    makeSpotifySettingsFactory(redirectUri),
    process.env.VITE_SPOTIFY_CLIENT_SECRET as string,
    makeAxiosHttpClient()
  );
};
