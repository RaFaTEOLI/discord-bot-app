import { HttpClient, HttpResponse, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { SpotifyPlaylistTrackListModel } from '@/domain/models';
import { LoadPlaylistTracks } from '@/domain/usecases';

export class RemoteLoadPlaylistTracks implements LoadPlaylistTracks {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<RemoteLoadPlaylistTracks.Model>,
    private readonly httpGetClientNext: HttpClient<SpotifyPlaylistTrackListModel>
  ) {}

  async load(id: string): Promise<LoadPlaylistTracks.Model> {
    const httpResponse = await this.httpGetClient.request({
      url: `${this.url}/${id}`,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });

    let items = httpResponse.body?.tracks?.items ?? [];
    let fetchNext = httpResponse.body?.tracks?.next;
    const href = httpResponse.body?.tracks?.href;

    if (fetchNext) {
      do {
        const httpResponseNext: HttpResponse<SpotifyPlaylistTrackListModel> = await this.httpGetClientNext.request({
          url: fetchNext,
          method: 'get',
          headers: { 'Content-Type': 'application/json' }
        });

        if (httpResponseNext.body?.items) {
          items = items.concat(httpResponseNext.body?.items);
        }

        fetchNext = httpResponseNext.body?.next as string;
      } while (fetchNext);
    }

    const playlistResponse = Object.assign({}, httpResponse.body, {
      tracks: {
        ...httpResponse.body?.tracks,
        href,
        items,
        total: items.length
      }
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return playlistResponse as LoadPlaylistTracks.Model;
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
