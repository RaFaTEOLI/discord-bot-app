import { HttpClientSpy, mockRemoteDiscordCommandListModel } from '@/data/mocks';
import { RemoteLoadDiscordCommands } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteLoadDiscordCommands;
  httpClientSpy: HttpClientSpy<RemoteLoadDiscordCommands.Model[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadDiscordCommands.Model[]>();
  const sut = new RemoteLoadDiscordCommands(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadDiscordCommands', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    await sut.all();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.all();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
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

  test('should return a list of CommandModels if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockRemoteDiscordCommandListModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const commandList = await sut.all();
    expect(commandList).toEqual(httpResult);
  });

  test('should return an empty list of LoadDiscordCommands.Model if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const commandList = await sut.all();
    expect(commandList).toEqual([]);
  });
});
