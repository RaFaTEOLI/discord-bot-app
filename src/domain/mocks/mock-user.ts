import { faker } from '@faker-js/faker';
import { SaveUser } from '../usecases';

export const mockSaveUserParams = (): SaveUser.Params => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  spotify: {
    accessToken: faker.datatype.uuid(),
    refreshToken: faker.datatype.uuid()
  }
});

export class SaveUserSpy implements SaveUser {
  url = faker.internet.url();
  data = mockSaveUserParams();
  callsCount = 0;

  async save(): Promise<void> {
    this.callsCount++;
  }
}
