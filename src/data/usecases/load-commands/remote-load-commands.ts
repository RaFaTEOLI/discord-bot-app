import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { CommandModel } from '@/domain/models';
import { LoadCommands } from '@/domain/usecases';

export class RemoteLoadCommands implements LoadCommands {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteLoadCommands.Model[]>) {}

  async all(): Promise<LoadCommands.Model[]> {
    const httpResponse = await this.httpClient.request({ url: this.url, method: 'get' });
    const remoteSurveys = httpResponse.body ?? [];
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return remoteSurveys;
      case HttpStatusCode.noContent:
        return [];
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadCommands {
  export type Model = CommandModel;
}
