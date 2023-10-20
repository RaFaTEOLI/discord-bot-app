import { HttpClientSpy } from '@/data/mocks';
import { RemoteLoadUserById } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { mockSpotifyUserById } from '@/domain/mocks';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteLoadUserById;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteLoadUserById(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadUserById', () => {
  test('should call HttpClient with correct URL, Method and Headers', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUserById()
    };
    const id = faker.datatype.uuid();
    await sut.loadById(id);
    expect(httpClientSpy.url).toBe(`${url}/${id}`);
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.loadById(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw AccessTokenExpiredError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.loadById(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new AccessTokenExpiredError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.loadById(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.loadById(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return a SpotifyUser if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyUserById();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const spotifyUser = await sut.loadById(faker.datatype.uuid());
    expect(spotifyUser).toEqual({
      display_name: httpResult.display_name,
      id: httpResult.id,
      external_urls: httpResult.external_urls,
      images: httpResult.images
    });
  });
});
