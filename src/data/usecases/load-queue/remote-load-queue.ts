import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { QueueModel } from '@/domain/models';
import { LoadQueue } from '@/domain/usecases';

export class RemoteLoadQueue implements LoadQueue {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteLoadQueue.Model[]>) {}

  async all(): Promise<LoadQueue.Model[]> {
    const httpResponse = await this.httpClient.request({ url: this.url, method: 'get' });
    const remoteQueue = httpResponse.body ?? [];
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return remoteQueue;
      case HttpStatusCode.noContent:
        return [];
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadQueue {
  export type Model = QueueModel;
}
