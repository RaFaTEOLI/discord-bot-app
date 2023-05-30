import { faker } from '@faker-js/faker';
import { Authentication, SaveUser } from '@/domain/usecases';

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

export const mockSaveUserParams = (): SaveUser.Params => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  spotify: {
    accessToken: faker.datatype.uuid(),
    refreshToken: faker.datatype.uuid()
  }
});
