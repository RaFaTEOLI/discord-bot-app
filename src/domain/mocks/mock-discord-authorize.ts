import { faker } from '@faker-js/faker';
import { DiscordAuthorize } from '@/domain/usecases';

export const mockDiscordAuthorizeParams = (): DiscordAuthorize.Params => {
  return {
    responseType: 'code',
    clientId: faker.datatype.uuid(),
    scope: 'email identify',
    redirectUri: faker.internet.url()
  };
};

export class DiscordAuthorizeSpy implements DiscordAuthorize {
  url = faker.internet.url();
  discordSettings = mockDiscordAuthorizeParams();
  callsCount = 0;

  async authorize(): Promise<string> {
    this.callsCount++;
    const settings = this.discordSettings;
    return Promise.resolve(
      `${this.url}?client_id=${settings.clientId}&redirect_uri=${settings.redirectUri}&response_type=${settings.responseType}&scope=${settings.scope}`
    );
  }
}
