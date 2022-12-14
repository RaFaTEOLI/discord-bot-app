import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadPlaylistTracks } from '@/domain/usecases';

export class RemoteLoadPlaylistTracks implements LoadPlaylistTracks {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadPlaylistTracks.Model>) {}

  async load(id: string): Promise<LoadPlaylistTracks.Model> {
    // TODO: now the response is limited by 50 tracks, add a check to fetch next paginations and push into an array then return all tracks
    const httpResponse = await this.httpGetClient.request({
      url: `${this.url}/${id}/tracks`,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadPlaylistTracks.Model;
      case HttpStatusCode.unauthorized:
        throw new AccessTokenExpiredError();
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadPlaylistTracks {
  export type Model = LoadPlaylistTracks.Model;
}
