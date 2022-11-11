import { mockSpotifyAuthorizeParams } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import { RemoteSpotifyAuthorize } from './remote-spotify-authorize';

type SutTypes = {
  sut: RemoteSpotifyAuthorize;
};

const makeSut = (url: string = faker.internet.url(), spotifySettings = mockSpotifyAuthorizeParams()): SutTypes => {
  const sut = new RemoteSpotifyAuthorize(url, spotifySettings);
  return {
    sut
  };
};

describe('RemoteSpotifyAuthorize', () => {
  test('should call return authorize url with correct values', async () => {
    const url = faker.internet.url();
    const spotifyAuthorizeParams = mockSpotifyAuthorizeParams();
    const { sut } = makeSut(url, spotifyAuthorizeParams);
    const generatedUrl = await sut.authorize();
    expect(generatedUrl).toBe(
      `${url}?response_type=${spotifyAuthorizeParams.responseType}&client_id=${
        spotifyAuthorizeParams.clientId
      }&scope=${encodeURIComponent(spotifyAuthorizeParams.scope)}&redirect_uri=${encodeURIComponent(
        spotifyAuthorizeParams.redirectUri
      )}&state=${spotifyAuthorizeParams.state}`
    );
  });
});
