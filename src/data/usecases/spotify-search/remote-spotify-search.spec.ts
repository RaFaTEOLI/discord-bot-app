import { HttpClientSpy } from '@/data/mocks';
import { RemoteSpotifySearch } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { mockSpotifySearch } from '@/domain/mocks';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteSpotifySearch;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteSpotifySearch(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSpotifySearch', () => {
  test('should call HttpClient with correct URL, Method and Headers', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifySearch()
    };
    const value = faker.random.word();
    await sut.search(value);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.params).toEqual({
      q: value,
      type: 'track,artist',
      market: 'US',
      limit: 20
    });
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.search(faker.random.word());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw AccessTokenExpiredError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.search(faker.random.word());
    await expect(promise).rejects.toThrow(new AccessTokenExpiredError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.search(faker.random.word());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.search(faker.random.word());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return SpotifySearch if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifySearch();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const spotifyUserPlaylistList = await sut.search(faker.random.word());
    expect(spotifyUserPlaylistList).toEqual(httpResult);
  });
});
