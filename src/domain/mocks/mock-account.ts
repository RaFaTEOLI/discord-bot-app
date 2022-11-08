import { faker } from '@faker-js/faker';
import { Authentication } from '@/domain/usecases';

export const mockAccountModel = (): Authentication.Model => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.fullName()
});
