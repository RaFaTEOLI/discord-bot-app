import { HttpClientSpy, mockRemoteQueueListModel } from '@/data/mocks';
import { RemoteLoadQueue } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteLoadQueue;
  httpClientSpy: HttpClientSpy<RemoteLoadQueue.Model[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadQueue.Model[]>();
  const sut = new RemoteLoadQueue(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadQueue', () => {
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

  test('should return a list of QueueModels if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockRemoteQueueListModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const queueList = await sut.all();
    expect(queueList).toEqual([
      {
        name: httpResult[0].name,
        author: httpResult[0].author,
        duration: httpResult[0].duration,
        thumbnail: httpResult[0].thumbnail,
        url: httpResult[0].url,
        id: httpResult[0].id
      },
      {
        name: httpResult[1].name,
        author: httpResult[1].author,
        duration: httpResult[1].duration,
        thumbnail: httpResult[1].thumbnail,
        url: httpResult[1].url,
        id: httpResult[1].id
      },
      {
        name: httpResult[2].name,
        author: httpResult[2].author,
        duration: httpResult[2].duration,
        thumbnail: httpResult[2].thumbnail,
        url: httpResult[2].url,
        id: httpResult[2].id
      }
    ]);
  });

  test('should return an empty list of LoadQueue.Model if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const queueList = await sut.all();
    expect(queueList).toEqual([]);
  });
});
