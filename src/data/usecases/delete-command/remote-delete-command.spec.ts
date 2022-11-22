import { HttpClientSpy } from '@/data/mocks';
import { RemoteDeleteCommand } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { ForbiddenError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: RemoteDeleteCommand;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteDeleteCommand(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteDeleteCommand', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const id = faker.datatype.uuid();
    await sut.delete(id);
    expect(httpClientSpy.url).toBe(`${url}/${id}`);
    expect(httpClientSpy.method).toBe('delete');
  });

  test('should throw ForbiddenError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new ForbiddenError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should delete a Command on 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const response = await sut.delete(faker.datatype.uuid());
    expect(response).toBeFalsy();
  });
});
