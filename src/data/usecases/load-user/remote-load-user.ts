import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadUser } from '@/domain/usecases';

export class RemoteLoadUser implements LoadUser {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadUser.Model>) {}

  async load(): Promise<LoadUser.Model> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadUser.Model;
      case HttpStatusCode.unauthorized:
        throw new AccessTokenExpiredError();
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
