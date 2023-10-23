import { HttpClientSpy } from '@/data/mocks';
import { RemoteSpotifyAuthenticate } from '@/data/usecases';
import { mockSpotifyAuthenticateParams, mockSpotifyAuthorizeParams, mockSpotifyAccessModel } from '@/domain/mocks';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteSpotifyAuthenticate;
  httpClientSpy: HttpClientSpy<RemoteSpotifyAuthenticate.Model>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteSpotifyAuthenticate.Model>();
  const fakeSpotifySettings = mockSpotifyAuthorizeParams();
  const sut = new RemoteSpotifyAuthenticate(url, fakeSpotifySettings, faker.datatype.uuid(), httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSpotifyAuthenticate', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const requestTokenParams = mockSpotifyAuthenticateParams();
    await sut.request(requestTokenParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toBeTruthy();
  });

  test('should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.request(mockSpotifyAuthenticateParams());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    };
    const promise = sut.request(mockSpotifyAuthenticateParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.request(mockSpotifyAuthenticateParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.request(mockSpotifyAuthenticateParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.request(mockSpotifyAuthenticateParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return an SpotifyAuthenticate.Model if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyAccessModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const account = await sut.request(mockSpotifyAuthenticateParams());
    expect(account).toEqual(httpResult);
  });
});
