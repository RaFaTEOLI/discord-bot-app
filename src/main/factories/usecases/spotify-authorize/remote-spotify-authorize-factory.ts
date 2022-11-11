import { SpotifyAuthorize } from '@/domain/usecases';
import { RemoteSpotifyAuthorize } from '@/data/usecases';

export const makeRemoteSpotifyAuthorize = (redirectUri: string): SpotifyAuthorize => {
  return new RemoteSpotifyAuthorize(process.env.VITE_SPOTIFY_AUTHORIZE_URL as string, {
    responseType: 'code',
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID as string,
    redirectUri,
    scope: 'user-read-private playlist-read-private user-read-email user-library-read',
    state: Date.now().toString()
  });
};
