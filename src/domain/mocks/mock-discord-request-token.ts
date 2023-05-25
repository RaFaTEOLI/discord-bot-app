import { faker } from '@faker-js/faker';
import { DiscordAuthenticate } from '@/domain/usecases';
import { mockDiscordAccessModel } from './mock-discord-access';

export const mockDiscordAuthenticateParams = (): DiscordAuthenticate.Params => {
  return {
    code: faker.datatype.uuid()
  };
};

export class DiscordAuthenticateSpy implements DiscordAuthenticate {
  url = faker.internet.url();
  discordSettings = mockDiscordAuthenticateParams();
  discordClientId = faker.datatype.uuid();
  access = mockDiscordAccessModel();
  callsCount = 0;

  async request(): Promise<DiscordAuthenticate.Model> {
    this.callsCount++;
    return Promise.resolve(this.access);
  }
}
