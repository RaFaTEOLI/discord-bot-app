import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { mockHttpRequest, GetStorageSpy, HttpClientSpy } from '@/data/mocks';
import { HttpRequest } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { describe, test, expect, vi } from 'vitest';
import { mockAccountWithSpotifyModel } from '@/domain/mocks';

type SutTypes = {
  sut: AuthorizeHttpClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpClientSpy = new HttpClientSpy();
  const sut = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy);
  return {
    sut,
    getStorageSpy,
    httpClientSpy
  };
};

describe('AuthorizeHttpClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();
    const getSpy = vi.spyOn(getStorageSpy, 'get');
    await sut.request(mockHttpRequest());
    const calls = [[process.env.VITE_LOCAL_STORAGE_TOKEN_IDENTIFIER as string]];
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

  test('should add headers to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = JSON.stringify(mockAccountWithSpotifyModel().user.spotify);
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
      headers: { test: 1 }
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      ...{ test: 1 },
      'x-access-token': getStorageSpy.value as string
    });
  });

  test('should add auth headers to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = JSON.stringify(mockAccountWithSpotifyModel().user.spotify);
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value as string
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
});
