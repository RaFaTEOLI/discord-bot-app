export const makeSpotifyApiUrl = (path: string): string => {
  let apiUrl = process.env.VITE_SPOTIFY_API_URL;
  if (!apiUrl) {
    apiUrl = 'https://api.spotify.com/v1';
  }
  if (path.startsWith('/')) {
    return `${apiUrl}${path}`;
  }
  return `${apiUrl}/${path}`;
};
