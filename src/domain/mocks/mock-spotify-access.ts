import { faker } from '@faker-js/faker';
import { SpotifyRequestToken } from '@/domain/usecases';

export const mockSpotifyAccessModel = (): SpotifyRequestToken.Model => ({
  access_token: faker.datatype.uuid(),
  token_type: 'Bearer',
  scope: 'user-read-private user-read-email',
  expires_in: 3600,
  refresh_token: faker.datatype.uuid()
});
