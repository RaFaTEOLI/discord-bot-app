import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { UnexpectedError } from '@/domain/errors';
import { LoadServer } from '@/domain/usecases';

export class RemoteLoadServer implements LoadServer {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<RemoteLoadServer.Model>) {}

  async load(): Promise<LoadServer.Model> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as LoadServer.Model;
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadServer {
  export type Model = LoadServer.Model;
}
