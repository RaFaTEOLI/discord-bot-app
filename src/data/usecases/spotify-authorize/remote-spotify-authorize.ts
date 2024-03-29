import { SpotifyAuthorize } from '@/domain/usecases';

export class RemoteSpotifyAuthorize implements SpotifyAuthorize {
  constructor(private readonly url: string, private readonly spotifySettings: SpotifyAuthorize.Params) {}

  async authorize(): Promise<string> {
    const queryString = `?response_type=${this.spotifySettings.responseType}&client_id=${
      this.spotifySettings.clientId
    }&scope=${encodeURIComponent(this.spotifySettings.scope)}&redirect_uri=${encodeURIComponent(
      this.spotifySettings.redirectUri
    )}${this.spotifySettings.state ? `&state=${this.spotifySettings.state}` : ''}`;
    return await Promise.resolve(`${this.url}${queryString}`);
  }
}
