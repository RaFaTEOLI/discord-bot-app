import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { EmailAlreadyBeingUsedError, UnexpectedError } from '@/domain/errors';
import { AddAccount } from '@/domain/usecases';

export class RemoteAddAccount implements AddAccount {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteAddAccount.Model>) {}

  async add(params: AddAccount.Params): Promise<AddAccount.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as AddAccount.Model;
      case HttpStatusCode.forbidden:
        throw new EmailAlreadyBeingUsedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteAddAccount {
  export type Model = AddAccount.Model;
}
