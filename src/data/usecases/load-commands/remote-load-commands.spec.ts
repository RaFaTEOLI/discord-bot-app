import { HttpClientSpy, mockRemoteCommandListModel } from '@/data/mocks';
import { RemoteLoadCommands } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: RemoteLoadCommands;
  httpClientSpy: HttpClientSpy<RemoteLoadCommands.Model[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadCommands.Model[]>();
  const sut = new RemoteLoadCommands(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadCommands', () => {
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
    const httpResult = mockRemoteCommandListModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const commandList = await sut.all();
    expect(commandList).toEqual([
      {
        id: httpResult[0].id,
        command: httpResult[0].command,
        description: httpResult[0].description,
        dispatcher: httpResult[0].dispatcher,
        type: httpResult[0].type,
        response: httpResult[0].response,
        discordType: httpResult[0].discordType
      },
      {
        id: httpResult[1].id,
        command: httpResult[1].command,
        description: httpResult[1].description,
        dispatcher: httpResult[1].dispatcher,
        type: httpResult[1].type,
        response: httpResult[1].response,
        discordType: httpResult[1].discordType
      },
      {
        id: httpResult[2].id,
        command: httpResult[2].command,
        description: httpResult[2].description,
        dispatcher: httpResult[2].dispatcher,
        type: httpResult[2].type,
        response: httpResult[2].response,
        discordType: httpResult[2].discordType
      }
    ]);
  });

  test('should return an empty list of LoadCommands.Model if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const commandList = await sut.all();
    expect(commandList).toEqual([]);
  });
});
