import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { CommandModel } from '@/domain/models';
import { DeleteCommand } from '@/domain/usecases';
import { ForbiddenError, UnexpectedError } from '@/domain/errors';

export class RemoteDeleteCommand implements DeleteCommand {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<void>) {}

  async delete(commandId: string): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${commandId}`,
      method: 'delete'
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

export namespace RemoteDeleteCommand {
  export type Model = CommandModel;
}
