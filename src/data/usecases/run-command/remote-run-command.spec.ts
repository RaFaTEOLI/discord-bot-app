import { HttpClientSpy } from '@/data/mocks';
import { RemoteRunCommand } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { UnexpectedError } from '@/domain/errors';

type SutTypes = {
  sut: RemoteRunCommand;
  httpClientSpy: HttpClientSpy;
  botName: string;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const botName = faker.internet.userName();
  const sut = new RemoteRunCommand(url, httpClientSpy, botName);

  return {
    sut,
    httpClientSpy,
    botName
  };
};

describe('RemoteRunCommand', () => {
  test('should call HttpClient with correct URL, Method, Headers, Body', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, botName } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const command = faker.word.verb();
    await sut.run(command);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(httpClientSpy.body).toEqual({
      username: `${botName} Web`,
      avatar_url: `https://robohash.org/${botName}?gravatar=hashed`,
      content: `!${command}`
    });
  });

  test('should throw UnexpectedError if HttpClient returns anything other than 204', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.run(faker.word.verb());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should run a Command on 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const command = faker.word.verb();
    const response = await sut.run(command);
    expect(response).toBeFalsy();
  });
});
