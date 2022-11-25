import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { MusicModel, SpotifySearchModel } from '@/domain/models';
import { LoadMusic } from '@/domain/usecases';

export class RemoteLoadMusic implements LoadMusic {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadMusic.Model>,
    private readonly spotifyUrl: string,
    private readonly spotifyHttpClient: HttpClient<SpotifySearchModel>
  ) {}

  async load(): Promise<LoadMusic.Model> {
    // TODO: integrate with spotify, when music is fetched from our db, search it on spotify to obtain thumbnail and song duration
    const httpResponse = await this.httpClient.request({ url: this.url, method: 'get' });
    let music = httpResponse.body;

    if (music?.name) {
      const searchResult = await this.spotifyHttpClient.request({
        url: this.spotifyUrl,
        method: 'get',
        params: {
          q: music.name,
          type: 'track,artist',
          market: 'US',
          limit: 1
        }
      });

      switch (searchResult.statusCode) {
        case HttpStatusCode.unauthorized:
          throw new AccessTokenExpiredError();
      }

      music = {
        ...music,
        thumbnail: searchResult.body?.tracks.items[0].album.images[0].url
      };
    }

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return music as LoadMusic.Model;
      case HttpStatusCode.noContent:
        return null;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadMusic {
  export type Model = MusicModel;
}
