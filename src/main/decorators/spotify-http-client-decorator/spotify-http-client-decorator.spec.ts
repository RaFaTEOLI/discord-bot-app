import { SpotifyHttpClientDecorator } from '@/main/decorators';
import { mockHttpRequest, GetStorageSpy, HttpClientSpy, SetStorageSpy } from '@/data/mocks';
import { HttpRequest, HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { describe, test, expect, vi } from 'vitest';
import { mockAccountWithSpotifyModel } from '@/domain/mocks';

type SutTypes = {
  sut: SpotifyHttpClientDecorator;
  getStorageSpy: GetStorageSpy;
  setStorageSpy: SetStorageSpy;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const setStorageSpy = new SetStorageSpy();
  const httpClientSpy = new HttpClientSpy();
  const url = faker.internet.url();
  const sut = new SpotifyHttpClientDecorator(getStorageSpy, setStorageSpy, httpClientSpy, url);
  return {
    sut,
    getStorageSpy,
    setStorageSpy,
    httpClientSpy
  };
};

describe('SpotifyHttpClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();
    const getSpy = vi.spyOn(getStorageSpy, 'get');
    await sut.request(mockHttpRequest());
    const calls = [[process.env.VITE_LOCAL_STORAGE_SPOTIFY_IDENTIFIER as string]];
    expect(getSpy.mock.calls).toEqual(calls);
  });

  test('should not add headers if GetStorage is invalid', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        field: faker.random.words()
      }
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('should add spotify token to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    const spotifyAccount = mockAccountWithSpotifyModel().user.spotify;
    getStorageSpy.value = JSON.stringify(spotifyAccount);
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      Authorization: `Bearer ${spotifyAccount?.accessToken as string}`
    });
  });

  test('should return the same result as HttpClient', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual(httpClientSpy.response);
  });

  test('should have default headers but overrides content-type', async () => {
    const { sut, httpClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = undefined;
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'multipart/form-data' });
  });

  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();
    const getSpy = vi.spyOn(getStorageSpy, 'get');
    const request = mockHttpRequest();
    request.url = 'https://api.spotify.com/search';
    await sut.request(request);
    const calls = [
      [process.env.VITE_LOCAL_STORAGE_SPOTIFY_IDENTIFIER as string],
      [process.env.VITE_LOCAL_STORAGE_GUEST_SPOTIFY_IDENTIFIER as string]
    ];
    expect(getSpy.mock.calls).toEqual(calls);
  });

  test('should add a guest spotify token when user does not have spotify token', async () => {
    const { sut, httpClientSpy } = makeSut();
    const guestToken = faker.datatype.uuid();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: {
        accessToken: guestToken,
        expiresAt: Date.now() + 1000
      }
    };

    const httpRequest: HttpRequest = {
      url: 'https://api.spotify.com/search',
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };

    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      Authorization: `Bearer ${guestToken}`
    });
  });

  test('should use guest spotify token when user does not have spotify token but already has a guest token', async () => {
    const { sut, httpClientSpy, getStorageSpy } = makeSut();
    const guestToken = faker.datatype.uuid();
    const accessTokenExpirationTimestampMs = Date.now() + 1000;
    getStorageSpy.value = JSON.stringify({
      guestToken,
      expiresAt: accessTokenExpirationTimestampMs
    });

    const httpRequest: HttpRequest = {
      url: 'https://api.spotify.com/search',
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };

    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      Authorization: `Bearer ${guestToken}`
    });
  });

  test('should not add a guest spotify token when spotify guest token retrieval fails', async () => {
    const { sut, httpClientSpy } = makeSut();
    vi.spyOn(httpClientSpy, 'request').mockRejectedValueOnce(new Error());

    const httpRequest: HttpRequest = {
      url: 'https://api.spotify.com/search',
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };

    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual(undefined);
  });

  test('should retrieve new guest spotify token when guest token is expired', async () => {
    const { sut, httpClientSpy, getStorageSpy } = makeSut();
    const guestToken = faker.datatype.uuid();
    const accessTokenExpirationTimestampMs = Date.now() - 1000;
    getStorageSpy.value = JSON.stringify({
      guestToken,
      expiresAt: accessTokenExpirationTimestampMs
    });

    const newGuestToken = faker.datatype.uuid();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: {
        accessToken: newGuestToken,
        expiresAt: Date.now() + 1000
      }
    };

    const httpRequest: HttpRequest = {
      url: 'https://api.spotify.com/search',
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };

    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      Authorization: `Bearer ${newGuestToken}`
    });
  });

  test('should not add a guest spotify token when route is not search', async () => {
    const { sut, httpClientSpy } = makeSut();

    const httpRequest: HttpRequest = {
      url: 'https://api.spotify.com/me',
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };

    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual(undefined);
  });
});
