import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/cache';
import { UserSpotifyModel } from '@/domain/models';

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(private readonly getStorage: GetStorage, private readonly httpClient: HttpClient) {}

  async request(data: HttpRequest): Promise<HttpResponse> {
    const accessToken = this.getStorage.get(process.env.VITE_LOCAL_STORAGE_TOKEN_IDENTIFIER as string) as string;
    const spotifyObj = this.getStorage.get(process.env.VITE_LOCAL_STORAGE_SPOTIFY_IDENTIFIER as string) as string;
    const spotifyAccessToken = spotifyObj ? (JSON.parse(spotifyObj) as UserSpotifyModel).accessToken : null;
    if (accessToken) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          ...(!data.url.includes('api.spotify') && !data.url.includes('discord.com') && { 'x-access-token': accessToken }),
          ...(spotifyAccessToken && data.url.includes('api.spotify') && { Authorization: `Bearer ${spotifyAccessToken}` }),
          ...(data.url.includes('discord.com') && { Authorization: `Bot ${process.env.VITE_DISCORD_BOT_TOKEN as string}` })
        })
      });
    }
    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}
