import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { CommandModel } from '@/domain/models';
import { SaveUser } from '@/domain/usecases';
import { ForbiddenError, UnexpectedError } from '@/domain/errors';

export class RemoteSaveUser implements SaveUser {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteSaveUser.Model>) {}

  async save(params: SaveUser.Params): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'patch',
      body: params
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent:
        return;
      case HttpStatusCode.forbidden:
        throw new ForbiddenError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSaveUser {
  export type Model = CommandModel;
}
