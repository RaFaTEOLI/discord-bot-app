import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyAuthorize, SpotifyAuthenticate } from '@/domain/usecases';
import { Buffer } from 'buffer';

export class RemoteSpotifyAuthenticate implements SpotifyAuthenticate {
  constructor(
    private readonly url: string,
    private readonly spotifySettings: SpotifyAuthorize.Params,
    private readonly spotifyClientSecret: string,
    private readonly httpClient: HttpClient<RemoteSpotifyAuthenticate.Model>
  ) {}

  async request(params: SpotifyAuthenticate.Params): Promise<SpotifyAuthenticate.Model> {
    const encodedAuthorization = Buffer.from(`${this.spotifySettings.clientId}:${this.spotifyClientSecret}`).toString(
      'base64'
    );

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: {
        ...params,
        redirectUri: this.spotifySettings.redirectUri,
        encodedAuthorization
      }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as SpotifyAuthenticate.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSpotifyAuthenticate {
  export type Model = SpotifyAuthenticate.Model;
}
