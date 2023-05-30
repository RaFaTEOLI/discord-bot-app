import { HttpClientSpy } from '@/data/mocks';
import { RemoteSaveUser } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { mockSaveUserParams } from '@/domain/mocks';
import { ForbiddenError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: RemoteSaveUser;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteSaveUser(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSaveUser', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const saveUserParams = mockSaveUserParams();
    await sut.save(saveUserParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('put');
    expect(httpClientSpy.body).toEqual(saveUserParams);
  });

  test('should throw ForbiddenError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.save(mockSaveUserParams());
    await expect(promise).rejects.toThrow(new ForbiddenError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.save(mockSaveUserParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.save(mockSaveUserParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should save User on 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const response = await sut.save(mockSaveUserParams());
    expect(response).toBeFalsy();
  });
});
