import { faker } from '@faker-js/faker';
import { SpotifyAuthenticate } from '@/domain/usecases';

export const mockSpotifyAccessModel = (): SpotifyAuthenticate.Model => ({
  accessToken: faker.datatype.uuid(),
  user: {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    spotify: {
      accessToken: faker.datatype.uuid(),
      refreshToken: faker.datatype.uuid()
    }
  }
});
