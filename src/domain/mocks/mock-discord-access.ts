import { faker } from '@faker-js/faker';
import { DiscordAuthenticate } from '@/domain/usecases';

export const mockDiscordAccessModel = (): DiscordAuthenticate.Model => ({
  access_token: faker.datatype.uuid(),
  expires_in: Number(faker.random.numeric(5)),
  refresh_token: faker.datatype.uuid(),
  scope: faker.word.verb(),
  token_type: 'Bearer'
});
