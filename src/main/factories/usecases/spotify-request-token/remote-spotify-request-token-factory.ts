import { RemoteSpotifyRequestToken } from '@/data/usecases';
import { makeApiUrl, makeAxiosHttpClient, makeSpotifySettingsFactory } from '@/main/factories/http';
import { SpotifyRequestToken } from '@/domain/usecases';

export const makeRemoteSpotifyRequestToken = (redirectUri: string): SpotifyRequestToken => {
  return new RemoteSpotifyRequestToken(
    makeApiUrl('/spotify/token'),
    makeSpotifySettingsFactory(redirectUri),
    process.env.VITE_SPOTIFY_CLIENT_SECRET as string,
    makeAxiosHttpClient()
  );
};
