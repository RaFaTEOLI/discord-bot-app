import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { CommandModel } from '@/domain/models';
import { LoadCommandById } from '@/domain/usecases';

export class RemoteLoadCommandById implements LoadCommandById {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteLoadCommandById.Model>) {}

  async loadById(id: string): Promise<LoadCommandById.Model> {
    const httpResponse = await this.httpClient.request({ url: `${this.url}/${id}`, method: 'get' });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadCommandById.Model;
      case HttpStatusCode.noContent:
        return undefined as unknown as LoadCommandById.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadCommandById {
  export type Model = CommandModel;
}
