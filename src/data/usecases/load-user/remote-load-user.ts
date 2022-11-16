import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { LoadUser } from '@/domain/usecases';

export class RemoteLoadUser implements LoadUser {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadUser.Model>) {}

  async load(): Promise<LoadUser.Model> {
    const httpResponse = await this.httpGetClient.request({ url: this.url, method: 'get' });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadUser.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadUser {
  export type Model = LoadUser.Model;
}
