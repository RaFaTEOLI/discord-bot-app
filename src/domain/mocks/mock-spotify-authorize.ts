import { faker } from '@faker-js/faker';
import { SpotifyAuthorize } from '@/domain/usecases';

export const mockSpotifyAuthorizeParams = (): SpotifyAuthorize.Params => {
  return {
    responseType: 'code',
    clientId: faker.datatype.uuid(),
    scope: 'user-read-private user-read-email',
    redirectUri: faker.internet.url(),
    state: faker.datatype.uuid()
  };
};

export class SpotifyAuthorizeSpy implements SpotifyAuthorize {
  url = faker.internet.url();
  spotifySettings = mockSpotifyAuthorizeParams();
  callsCount = 0;

  async authorize(): Promise<string> {
    this.callsCount++;
    const settings = this.spotifySettings;
    return Promise.resolve(
      `${this.url}?response_type=${settings.responseType}&client_id${settings.clientId}&scope=${
        settings.scope
      }&redirect_uri=${settings.redirectUri}&state=${settings.state as string}`
    );
  }
}
