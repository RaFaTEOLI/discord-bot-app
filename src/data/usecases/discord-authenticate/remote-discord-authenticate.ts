import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { DiscordAuthorize, DiscordAuthenticate } from '@/domain/usecases';

export class RemoteDiscordAuthenticate implements DiscordAuthenticate {
  constructor(
    private readonly url: string,
    private readonly discordSettings: DiscordAuthorize.Params,
    private readonly discordClientSecret: string,
    private readonly httpClient: HttpClient<RemoteDiscordAuthenticate.Model>
  ) {}

  async request(params: DiscordAuthenticate.Params): Promise<DiscordAuthenticate.Model> {
    const bodyParams = new URLSearchParams();
    bodyParams.append('client_id', this.discordSettings.clientId);
    bodyParams.append('client_secret', this.discordClientSecret);
    bodyParams.append('grant_type', 'authorization_code');
    bodyParams.append('code', params.code);
    bodyParams.append('redirect_uri', this.discordSettings.redirectUri);

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: bodyParams
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as DiscordAuthenticate.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteDiscordAuthenticate {
  export type Model = DiscordAuthenticate.Model;
}
