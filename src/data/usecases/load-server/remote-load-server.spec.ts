import { HttpClientSpy } from '@/data/mocks';
import { RemoteLoadServer } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { mockServerModel, mockSpotifyUser } from '@/domain/mocks';

type SutTypes = {
  sut: RemoteLoadServer;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteLoadServer(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteLoadServer', () => {
  test('should call HttpClient with correct URL, Method and Headers', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyUser()
    };
    await sut.load();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return Server info if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockServerModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const server = await sut.load();
    expect(server).toEqual({
      id: httpResult.id,
      name: httpResult.name,
      instant_invite: httpResult.instant_invite,
      channels: httpResult.channels,
      members: httpResult.members,
      presence_count: httpResult.presence_count
    });
  });
});
