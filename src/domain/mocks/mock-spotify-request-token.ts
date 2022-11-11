import { faker } from '@faker-js/faker';
import { SpotifyAuthenticate } from '@/domain/usecases';
import { mockSpotifyAccessModel } from './mock-spotify-access';

export const mockSpotifyAuthenticateParams = (): SpotifyAuthenticate.Params => {
  return {
    code: faker.datatype.uuid(),
    state: faker.datatype.uuid()
  };
};

export class SpotifyAuthenticateSpy implements SpotifyAuthenticate {
  url = faker.internet.url();
  spotifySettings = mockSpotifyAuthenticateParams();
  spotifyClientId = faker.datatype.uuid();
  access = mockSpotifyAccessModel();
  callsCount = 0;

  async request(): Promise<SpotifyAuthenticate.Model> {
    this.callsCount++;
    return Promise.resolve(this.access);
  }
}
