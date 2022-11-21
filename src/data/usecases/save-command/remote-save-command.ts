import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { CommandModel } from '@/domain/models';
import { SaveCommand } from '@/domain/usecases';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';

export class RemoteSaveCommand implements SaveCommand {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteSaveCommand.Model>) {}

  async save(params: SaveCommand.Params): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: params.id ? 'put' : 'post',
      body: params
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent:
        return;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSaveCommand {
  export type Model = CommandModel;
}
