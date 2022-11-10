import { faker } from '@faker-js/faker';
import { SpotifyRequestToken } from '@/domain/usecases';
import { mockSpotifyAccessModel } from './mock-spotify-access';

export const mockSpotifyRequestTokenParams = (): SpotifyRequestToken.Params => {
  return {
    code: faker.datatype.uuid(),
    state: faker.datatype.uuid()
  };
};

export class SpotifyRequestTokenSpy implements SpotifyRequestToken {
  url = faker.internet.url();
  spotifySettings = mockSpotifyRequestTokenParams();
  spotifyClientId = faker.datatype.uuid();
  access = mockSpotifyAccessModel();
  callsCount = 0;

  async request(): Promise<SpotifyRequestToken.Model> {
    this.callsCount++;
    return Promise.resolve(this.access);
  }
}
