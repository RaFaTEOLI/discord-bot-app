import { SpotifyAuthorize } from '@/domain/usecases';
import { RemoteSpotifyAuthorize } from '@/data/usecases';

export const makeRemoteSpotifyAuthorize = (): SpotifyAuthorize => {
  return new RemoteSpotifyAuthorize(process.env.VITE_SPOTIFY_AUTHORIZE_URL as string, {
    responseType: 'code',
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID as string,
    redirectUri: process.env.VITE_SPOTIFY_REDIRECT_URI as string,
    scope: 'user-read-private playlist-read-private user-read-email user-library-read',
    state: Date.now().toString()
  });
};
