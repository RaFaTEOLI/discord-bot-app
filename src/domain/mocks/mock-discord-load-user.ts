import { faker } from '@faker-js/faker';
import { DiscordLoadUser } from '@/domain/usecases';
import { DiscordUserModel } from '@/domain/models';

export const mockDiscordUserModel = (): DiscordUserModel => ({
  user: {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    global_name: null,
    avatar: faker.internet.avatar(),
    discriminator: faker.random.numeric(4),
    public_flags: 0,
    avatar_decoration: null
  }
});

export class DiscordLoadUserSpy implements DiscordLoadUser {
  url = faker.internet.url();
  access = mockDiscordUserModel();
  callsCount = 0;

  async load(): Promise<DiscordLoadUser.Model> {
    this.callsCount++;
    return Promise.resolve(this.access);
  }
}
