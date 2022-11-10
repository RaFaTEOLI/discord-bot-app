import { SpotifyAuthorize } from '@/domain/usecases';

export const makeSpotifySettingsFactory = (): SpotifyAuthorize.Params => ({
  responseType: 'code',
  clientId: process.env.VITE_SPOTIFY_CLIENT_ID as string,
  redirectUri: process.env.VITE_SPOTIFY_REDIRECT_URI as string,
  scope: 'user-read-private playlist-read-private user-read-email user-library-read',
  state: Date.now().toString()
});
