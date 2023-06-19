import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyAuthorize, SpotifyRefreshToken } from '@/domain/usecases';
import { Buffer } from 'buffer';

export class RemoteSpotifyRefreshToken implements SpotifyRefreshToken {
  constructor(
    private readonly url: string,
    private readonly spotifySettings: SpotifyAuthorize.Params,
    private readonly spotifyClientSecret: string,
    private readonly httpClient: HttpClient<RemoteSpotifyRefreshToken.Model>
  ) {}

  async refresh(params: SpotifyRefreshToken.Params): Promise<SpotifyRefreshToken.Model> {
    const encodedAuthorization = Buffer.from(`${this.spotifySettings.clientId}:${this.spotifyClientSecret}`).toString(
      'base64'
    );

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: {
        ...params,
        encodedAuthorization
      }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body as SpotifyRefreshToken.Model;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSpotifyRefreshToken {
  export type Model = SpotifyRefreshToken.Model;
}
