import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { DiscordCommandModel } from '@/domain/models';
import { LoadDiscordCommands } from '@/domain/usecases';

export class RemoteLoadDiscordCommands implements LoadDiscordCommands {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteLoadDiscordCommands.Model[]>) {}

  async all(): Promise<LoadDiscordCommands.Model> {
    const httpResponse = await this.httpClient.request({ url: this.url, method: 'get' });
    const remoteCommands = httpResponse.body ?? [];
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return remoteCommands;
      case HttpStatusCode.noContent:
        return [];
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadDiscordCommands {
  export type Model = DiscordCommandModel;
}
