import { HttpStatusCode } from '@/data/protocols/http';
import { HttpClientSpy } from '@/data/mocks';
import { EmailAlreadyBeingUsedError, UnexpectedError } from '@/domain/errors';
import { mockAddAccountParams, mockAddAccountModel } from '@/domain/mocks';
import { RemoteAddAccount } from '@/data/usecases';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: RemoteAddAccount;
  httpClientSpy: HttpClientSpy<RemoteAddAccount.Model>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteAddAccount.Model>();
  const sut = new RemoteAddAccount(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteAddAccount', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toEqual(addAccountParams);
  });

  test('should throw EmailAlreadyBeingUsed if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new EmailAlreadyBeingUsedError());
  });

  test('should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    };
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return an AddAccount.Model if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockAddAccountModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(httpResult);
  });
});
