import { HttpClientSpy, mockRemoteMusicModel, mockRemoteSpotifySearchModel } from '@/data/mocks';
import { RemoteLoadMusic } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { SpotifySearchModel } from '@/domain/models';

type SutTypes = {
  sut: RemoteLoadMusic;
  httpClientSpy: HttpClientSpy<RemoteLoadMusic.Model>;
  spotifyHttpClientSpy: HttpClientSpy<SpotifySearchModel>;
};

const makeSut = (url = faker.internet.url(), spotifyUrl = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadMusic.Model>();
  const spotifyHttpClientSpy = new HttpClientSpy<SpotifySearchModel>();
  const sut = new RemoteLoadMusic(url, httpClientSpy, spotifyUrl, spotifyHttpClientSpy);
  return {
    sut,
    httpClientSpy,
    spotifyHttpClientSpy
  };
};

describe('RemoteLoadMusic', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    await sut.load();
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw AccessTokenExpiredError if SpotifyHttpClient returns 401', async () => {
    const { sut, httpClientSpy, spotifyHttpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockRemoteMusicModel()
    };
    spotifyHttpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new AccessTokenExpiredError());
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

  test('should return a MusicModel if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockRemoteMusicModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const music = await sut.load();
    expect(music).toEqual({
      id: httpResult.id,
      name: httpResult.name,
      startedAt: httpResult.startedAt
    });
  });

  test('should return null of LoadMusic.Model if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    const music = await sut.load();
    expect(music).toBeNull();
  });

  test('should call SpotifyHttpClient with correct URL, Method and Params', async () => {
    const url = faker.internet.url();
    const httpResult = mockRemoteMusicModel();
    const { sut, httpClientSpy, spotifyHttpClientSpy } = makeSut(faker.internet.url(), url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    await sut.load();
    expect(spotifyHttpClientSpy.url).toBe(url);
    expect(spotifyHttpClientSpy.method).toBe('get');
    expect(spotifyHttpClientSpy.params).toEqual({
      q: httpResult.name,
      type: 'track,artist',
      market: 'US',
      limit: 1
    });
  });

  test('should return a MusicModel with thumbnail if HttpClient returns 200', async () => {
    const url = faker.internet.url();
    const httpResult = mockRemoteMusicModel();
    const spotifyHttpResult = mockRemoteSpotifySearchModel();
    const { sut, httpClientSpy, spotifyHttpClientSpy } = makeSut(faker.internet.url(), url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    spotifyHttpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: spotifyHttpResult
    };
    const music = await sut.load();
    expect(music).toEqual({
      id: httpResult.id,
      name: httpResult.name,
      startedAt: httpResult.startedAt,
      thumbnail: spotifyHttpResult.tracks.items[0].album.images[0].url
    });
  });
});
