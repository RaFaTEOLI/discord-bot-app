import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';
import { GetStorage, SetStorage } from '@/data/protocols/cache';
import { UserSpotifyModel } from '@/domain/models';

export class SpotifyHttpClientDecorator implements HttpClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly setStorage: SetStorage,
    private readonly httpClient: HttpClient, // TODO: Replace this httpClient with a usecase
    private readonly url: string
  ) {}

  async getSpotifyAccessToken(data: HttpRequest): Promise<string | null> {
    const spotifyObj = this.getStorage.get(process.env.VITE_LOCAL_STORAGE_SPOTIFY_IDENTIFIER as string) as string;
    const spotifyAccessToken = spotifyObj ? (JSON.parse(spotifyObj) as UserSpotifyModel).accessToken : null;

    // Use guest token if user token is not available
    if (!spotifyAccessToken && data.url.endsWith('search')) {
      const guessTokenObjStr = this.getStorage.get(
        process.env.VITE_LOCAL_STORAGE_GUEST_SPOTIFY_IDENTIFIER as string
      ) as string;
      const guessTokenObj = guessTokenObjStr ? JSON.parse(guessTokenObjStr) : null;

      if (Date.now() > guessTokenObj?.expiresAt || !guessTokenObj?.guestToken) {
        try {
          const response = await this.httpClient.request({
            url: this.url,
            method: 'get'
          });
          if (response.statusCode === 200 && response.body?.accessToken) {
            this.setStorage.set(
              process.env.VITE_LOCAL_STORAGE_GUEST_SPOTIFY_IDENTIFIER as string,
              JSON.stringify({
                guestToken: response.body.accessToken,
                expiresAt: response.body.expiresAt
              })
            );
            return response.body.accessToken;
          }
        } catch (error) {
          return null;
        }
      }

      return guessTokenObj?.guestToken;
    }

    return spotifyAccessToken;
  }

  async request(data: HttpRequest): Promise<HttpResponse> {
    const accessToken = await this.getSpotifyAccessToken(data);

    if (accessToken) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` })
        })
      });
    }
    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}
