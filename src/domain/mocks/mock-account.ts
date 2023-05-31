import { faker } from '@faker-js/faker';
import { Authentication } from '@/domain/usecases';

export const mockAccountModel = (): Authentication.Model => ({
  accessToken: faker.datatype.uuid(),
  user: {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    id: faker.datatype.uuid()
  }
});

export const mockAccountWithSpotifyModel = (): Authentication.Model => ({
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

export const mockAccountWithDiscordModel = (): Authentication.Model => ({
  accessToken: faker.datatype.uuid(),
  user: {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    discord: {
      id: faker.datatype.uuid(),
      username: faker.internet.userName(),
      avatar: faker.internet.avatar(),
      discriminator: '0000'
    }
  }
});
