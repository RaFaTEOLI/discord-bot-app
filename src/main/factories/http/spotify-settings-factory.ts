import { SpotifyAuthorize } from '@/domain/usecases';

export const makeSpotifySettingsFactory = (
  redirectUri = process.env.VITE_SPOTIFY_LOGIN_REDIRECT_URI as string
): SpotifyAuthorize.Params => ({
  responseType: 'code',
  clientId: process.env.VITE_SPOTIFY_CLIENT_ID as string,
  redirectUri,
  scope: 'user-read-private playlist-read-private user-read-email user-library-read',
  state: Date.now().toString()
});
