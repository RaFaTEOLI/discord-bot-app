import { HttpClientSpy } from '@/data/mocks';
import { RemoteSaveCommand } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { mockSaveCommandParams } from '@/domain/mocks';
import { ForbiddenError, UnexpectedError, CommandAlreadyCreatedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { describe, test, expect } from 'vitest';

type SutTypes = {
  sut: RemoteSaveCommand;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteSaveCommand(url, httpClientSpy);
  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSaveCommand', () => {
  test('should call HttpClient with correct values when id is provided', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const saveCommandParams = Object.assign({}, mockSaveCommandParams(), { id: faker.datatype.uuid() });
    await sut.save(saveCommandParams);
    expect(httpClientSpy.url).toBe(`${url}/${saveCommandParams.id}`);
    expect(httpClientSpy.method).toBe('put');
    expect(httpClientSpy.body).toEqual(saveCommandParams);
  });

  test('should call HttpClient with correct values when id is not provided', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const saveCommandParams = mockSaveCommandParams();
    await sut.save(saveCommandParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toEqual(saveCommandParams);
  });

  test('should throw ForbiddenError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new ForbiddenError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should save a Command on 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const response = await sut.save(mockSaveCommandParams());
    expect(response).toBeFalsy();
  });

  test('should throw CommandAlreadyCreatedError if HttpClient returns 400 with CommandAlreadyCreatedError message', async () => {
    const { sut, httpClientSpy } = makeSut();
    const saveCommandParams = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
      body: {
        error: `There is already a command created with this name: ${saveCommandParams.command}`
      }
    };
    const promise = sut.save(saveCommandParams);
    await expect(promise).rejects.toThrow(new CommandAlreadyCreatedError(saveCommandParams.command));
  });
});
