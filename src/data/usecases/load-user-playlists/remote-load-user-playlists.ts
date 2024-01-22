import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadUserPlaylists } from '@/domain/usecases';

export class RemoteLoadUserPlaylists implements LoadUserPlaylists {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadUserPlaylists.Model>) {}

  async all(offset = 0): Promise<LoadUserPlaylists.Model> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      params: { offset, limit: 50 }
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
