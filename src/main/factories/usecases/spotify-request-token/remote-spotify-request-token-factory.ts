import { RemoteSpotifyRequestToken } from '@/data/usecases';
import { makeAxiosHttpClient, makeSpotifySettingsFactory } from '@/main/factories/http';
import { SpotifyRequestToken } from '@/domain/usecases';

export const makeRemoteSpotifyRequestToken = (): SpotifyRequestToken => {
  return new RemoteSpotifyRequestToken(
    'https://accounts.spotify.com/api/token',
    makeSpotifySettingsFactory(),
    process.env.VITE_SPOTIFY_CLIENT_ID as string,
    makeAxiosHttpClient()
  );
};
