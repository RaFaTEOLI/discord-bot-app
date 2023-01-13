import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { LoadUserById } from '@/domain/usecases';

export class RemoteLoadUserById implements LoadUserById {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadUserById.Model>) {}

  async loadById(id: string): Promise<LoadUserById.Model> {
    const httpResponse = await this.httpGetClient.request({
      url: `${this.url}/${id}`,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadUserById.Model;
      case HttpStatusCode.unauthorized:
        throw new AccessTokenExpiredError();
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadUserById {
  export type Model = LoadUserById.Model;
}
