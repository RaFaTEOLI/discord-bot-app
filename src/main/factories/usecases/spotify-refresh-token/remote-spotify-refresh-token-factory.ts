import { RemoteSpotifyRefreshToken } from '@/data/usecases';
import { makeApiUrl, makeAxiosHttpClient, makeSpotifySettingsFactory } from '@/main/factories/http';
import { SpotifyRefreshToken } from '@/domain/usecases';

export const makeRemoteSpotifyRefreshToken = (): SpotifyRefreshToken => {
  return new RemoteSpotifyRefreshToken(
    makeApiUrl('/spotify/refresh-token'),
    makeSpotifySettingsFactory(),
    process.env.VITE_SPOTIFY_CLIENT_SECRET as string,
    makeAxiosHttpClient()
  );
};
