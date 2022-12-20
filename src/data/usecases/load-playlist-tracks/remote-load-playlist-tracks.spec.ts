import { HttpClientSpy } from '@/data/mocks';
import { RemoteLoadPlaylistTracks } from '@/data/usecases';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, AccessTokenExpiredError, UnexpectedError } from '@/domain/errors';
import { faker } from '@faker-js/faker';
import { mockSpotifyPlaylistTracksList } from '@/domain/mocks';

type SutTypes = {
  sut: RemoteLoadPlaylistTracks;
  httpClientSpy: HttpClientSpy;
  httpClientSpyNext: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const httpClientSpyNext = new HttpClientSpy();
  const sut = new RemoteLoadPlaylistTracks(url, httpClientSpy, httpClientSpyNext);

  return {
    sut,
    httpClientSpy,
    httpClientSpyNext
  };
};

describe('RemoteLoadPlaylistTracks', () => {
  test('should call HttpClient with correct URL, Method and Headers', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockSpotifyPlaylistTracksList()
    };
    const id = faker.datatype.uuid();
    await sut.load(id);
    expect(httpClientSpy.url).toBe(`${url}/${id}/tracks`);
    expect(httpClientSpy.method).toBe('get');
    expect(httpClientSpy.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.load(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw AccessTokenExpiredError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    };
    const promise = sut.load(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new AccessTokenExpiredError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.load(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.load(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return a list of SpotifyTracks if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSpotifyPlaylistTracksList();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const spotifyUserPlaylistList = await sut.load(faker.datatype.uuid());
    expect(spotifyUserPlaylistList).toEqual({
      href: httpResult.href,
      items: httpResult.items,
      limit: httpResult.limit,
      next: httpResult.next,
      offset: httpResult.offset,
      previous: httpResult.previous,
      total: httpResult.total
    });
  });

  test('should return a list of SpotifyTracks using pagination if HttpClient returns 200', async () => {
    const { sut, httpClientSpy, httpClientSpyNext } = makeSut();
    const httpResult = mockSpotifyPlaylistTracksList(200);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };

    const httpResultNext = mockSpotifyPlaylistTracksList(100);
    httpClientSpyNext.response = {
      statusCode: HttpStatusCode.success,
      body: httpResultNext
    };
    const items = httpResult.items.concat(httpResultNext.items);
    const spotifyUserPlaylistList = await sut.load(faker.datatype.uuid());
    expect(spotifyUserPlaylistList).toEqual({
      href: httpResult.href,
      items,
      limit: httpResult.limit,
      next: httpResult.next,
      offset: httpResult.offset,
      previous: httpResult.previous,
      total: httpResult.total
    });
    expect(spotifyUserPlaylistList.items.length).toBe(200);
  });

  test('should return empty items if HttpClient returns undefined', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success
    };
    const spotifyUserPlaylistList = await sut.load(faker.datatype.uuid());
    expect(spotifyUserPlaylistList).toEqual({
      items: []
    });
  });

  test('should return empty items if HttpClient returns undefined', async () => {
    const { sut, httpClientSpy, httpClientSpyNext } = makeSut();
    const httpResult = mockSpotifyPlaylistTracksList(200);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    httpClientSpyNext.response = {
      statusCode: HttpStatusCode.success
    };
    const spotifyUserPlaylistList = await sut.load(faker.datatype.uuid());
    expect(spotifyUserPlaylistList).toEqual({
      href: httpResult.href,
      items: httpResult.items,
      limit: httpResult.limit,
      next: httpResult.next,
      offset: httpResult.offset,
      previous: httpResult.previous,
      total: httpResult.total
    });
  });
});
