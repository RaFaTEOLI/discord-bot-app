import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { MusicModel } from '@/domain/models';
import { LoadMusic } from '@/domain/usecases';

export class RemoteLoadMusic implements LoadMusic {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteLoadMusic.Model>) {}

  async load(): Promise<LoadMusic.Model> {
    // TODO: integrate with spotify, when music is fetched from our db, search it on spotify to obtain thumbnail and song duration
    const httpResponse = await this.httpClient.request({ url: this.url, method: 'get' });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadMusic.Model;
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
