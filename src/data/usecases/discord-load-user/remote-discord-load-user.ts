import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { DiscordLoadUser } from '@/domain/usecases';

export class RemoteDiscordLoadUser implements DiscordLoadUser {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<RemoteDiscordLoadUser.Model>) {}

  async load(accessToken: string): Promise<DiscordLoadUser.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as DiscordLoadUser.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteDiscordLoadUser {
  export type Model = DiscordLoadUser.Model;
}
