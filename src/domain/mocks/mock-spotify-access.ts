import { faker } from '@faker-js/faker';
import { SpotifyAuthenticate } from '@/domain/usecases';

export const mockSpotifyAccessModel = (): SpotifyAuthenticate.Model => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.fullName(),
  spotify: {
    accessToken: faker.datatype.uuid(),
    refreshToken: faker.datatype.uuid()
  }
});
