import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { SpotifySearch } from '@/domain/usecases';

export class RemoteSpotifySearch implements SpotifySearch {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteSpotifySearch.Model>) {}

  async search(value: string): Promise<SpotifySearch.Model> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
      params: {
        q: value,
        type: 'track,artist',
        market: 'US',
        limit: 20
      }
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as SpotifySearch.Model;
      case HttpStatusCode.unauthorized:
        throw new AccessTokenExpiredError();
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSpotifySearch {
  export type Model = SpotifySearch.Model;
}
