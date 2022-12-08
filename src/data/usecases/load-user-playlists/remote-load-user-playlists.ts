import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadUserPlaylists } from '@/domain/usecases';

export class RemoteLoadUserPlaylists implements LoadUserPlaylists {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadUserPlaylists.Model>) {}

  async all(): Promise<LoadUserPlaylists.Model> {
    // TODO: now the response is limited by 50 playlists, in the future add a check to fetch next paginations and push into an array then return all playlists
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadUserPlaylists.Model;
      case HttpStatusCode.unauthorized:
        throw new AccessTokenExpiredError();
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadUserPlaylists {
  export type Model = LoadUserPlaylists.Model;
}
