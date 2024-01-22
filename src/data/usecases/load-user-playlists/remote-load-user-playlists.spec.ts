import { HttpClientSpy } from '@/data/mocks';
import { RemoteLoadUserPlaylists } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { mockSpotifyPlaylistList } from '@/domain/mocks';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteLoadUserPlaylists;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteLoadUserPlaylists(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadUserPlaylists', () => {
  test('should call HttpClient with correct URL, Method and Headers', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyPlaylistList()
    };
    await sut.all();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.params).toEqual({ offset: 0, limit: 50 });
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw AccessTokenExpiredError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new AccessTokenExpiredError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return a list of SpotifyPlaylist if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyPlaylistList();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const spotifyUserPlaylistList = await sut.all();
    expect(spotifyUserPlaylistList).toEqual({
      href: httpResult.href,
      items: httpResult.items,
      limit: httpResult.limit,
      next: httpResult.next,
      offset: httpResult.offset,
      previous: httpResult.previous,
      total: httpResult.total
    });
  });

  test('should call HttpClient with correct offset when provided', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyPlaylistList()
    };
    const offset = faker.datatype.number();
    await sut.all(offset);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.params).toEqual({ offset, limit: 50 });
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'application/json' });
  });
});
