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
