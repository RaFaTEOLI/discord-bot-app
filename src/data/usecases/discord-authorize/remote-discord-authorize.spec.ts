import { mockDiscordAuthorizeParams } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import { RemoteDiscordAuthorize } from './remote-discord-authorize';

type SutTypes = {
  sut: RemoteDiscordAuthorize;
};

const makeSut = (url: string = faker.internet.url(), discordSettings = mockDiscordAuthorizeParams()): SutTypes => {
  const sut = new RemoteDiscordAuthorize(url, discordSettings);
  return {
    sut
  };
};

describe('RemoteDiscordAuthorize', () => {
  test('should call return authorize url with correct values', async () => {
    const url = faker.internet.url();
    const discordAuthorizeParams = mockDiscordAuthorizeParams();
    const { sut } = makeSut(url, discordAuthorizeParams);
    const generatedUrl = await sut.authorize();
    expect(generatedUrl).toBe(
      `${url}?client_id=${discordAuthorizeParams.clientId}&redirect_uri=${discordAuthorizeParams.redirectUri}&response_type=${discordAuthorizeParams.responseType}&scope=${discordAuthorizeParams.scope}`
    );
  });
});
