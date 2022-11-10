import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyAuthorize, SpotifyRequestToken } from '@/domain/usecases';
import FormData from 'form-data';

export class RemoteSpotifyRequestToken implements SpotifyRequestToken {
  constructor(
    private readonly url: string,
    private readonly spotifySettings: SpotifyAuthorize.Params,
    private readonly spotifyClientSecret: string,
    private readonly httpClient: HttpClient<RemoteSpotifyRequestToken.Model>
  ) {}

  async request(params: SpotifyRequestToken.Params): Promise<SpotifyRequestToken.Model> {
    console.log({ params });
    const form = new FormData();
    form.append('code', params.code);
    form.append('state', params.state);
    form.append('grant_type', 'grant_type');
    form.append('redirect_uri', this.spotifySettings.redirectUri);

    console.log({ form });

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.spotifySettings.clientId}:${this.spotifyClientSecret}`).toString(
          'base64'
        )}`
      }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as SpotifyRequestToken.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSpotifyRequestToken {
  export type Model = SpotifyRequestToken.Model;
}
