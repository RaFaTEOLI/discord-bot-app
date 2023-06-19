import { faker } from '@faker-js/faker';
import { SpotifyRefreshToken } from '@/domain/usecases';

export const mockSpotifyRefreshTokenParams = (): SpotifyRefreshToken.Params => {
  return {
    refreshToken: faker.datatype.uuid()
  };
};

export class SpotifyRefreshTokenSpy implements SpotifyRefreshToken {
  url = faker.internet.url();
  spotifySettings = mockSpotifyRefreshTokenParams();
  spotifyClientId = faker.datatype.uuid();
  access = { accessToken: faker.datatype.uuid() };
  callsCount = 0;

  async refresh(): Promise<SpotifyRefreshToken.Model> {
    this.callsCount++;
    return Promise.resolve(this.access);
  }
}
