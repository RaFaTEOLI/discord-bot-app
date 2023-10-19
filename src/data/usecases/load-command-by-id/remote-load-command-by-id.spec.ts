import { HttpClientSpy } from '@/data/mocks';
import { RemoteLoadCommandById } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { mockCommandModel } from '@/domain/mocks';

type SutTypes = {
  sut: RemoteLoadCommandById;
  httpClientSpy: HttpClientSpy<RemoteLoadCommandById.Model>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadCommandById.Model>();
  const sut = new RemoteLoadCommandById(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadCommandById', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const id = faker.datatype.uuid();
    await sut.loadById(id);
    expect(httpClientSpy.url).toBe(`${url}/${id}`);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.loadById(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
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

  test('should return a CommandModel if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockCommandModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const command = await sut.loadById(faker.datatype.uuid());
    expect(command).toEqual({
      id: httpResult.id,
      command: httpResult.command,
      description: httpResult.description,
      dispatcher: httpResult.dispatcher,
      type: httpResult.type,
      response: httpResult.response,
      options: httpResult.options,
      discordType: httpResult.discordType
    });
  });

  test('should return undefined if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const command = await sut.loadById(faker.datatype.uuid());
    expect(command).toBe(undefined);
  });
});
