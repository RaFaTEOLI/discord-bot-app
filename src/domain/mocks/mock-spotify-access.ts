import { faker } from '@faker-js/faker';
import { SpotifyRequestToken } from '@/domain/usecases';

export const mockSpotifyAccessModel = (): SpotifyRequestToken.Model => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.fullName(),
  spotify: {
    accessToken: faker.datatype.uuid(),
    refreshToken: faker.datatype.uuid()
  }
});
