import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { mockHttpRequest, GetStorageSpy, HttpClientSpy } from '@/data/mocks';
import { HttpRequest } from '@/data/protocols/http';
import { mockAccountModel, mockAccountWithSpotifyModel } from '@/domain/mocks';
import { faker } from '@faker-js/faker';
import { AccountModel } from '@/domain/models';

type SutTypes = {
  sut: AuthorizeHttpClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpClientSpy = new HttpClientSpy();
  const sut = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy);
  return {
    sut,
    getStorageSpy,
    httpClientSpy
  };
};

describe('AuthorizeHttpClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();
    await sut.request(mockHttpRequest());
    expect(getStorageSpy.key).toBe('account');
  });

  test('should not add headers if GetStorage is invalid', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        field: faker.random.words()
      }
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('should add headers to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete'])
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken
    });
  });

  test('should merge headers to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const field = faker.random.words();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        field
      }
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken
    });
  });

  test('should merge headers to HttpClient with SpotifyAccess', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = mockAccountWithSpotifyModel();
    const storageValue: AccountModel = getStorageSpy.value;
    const field = faker.random.words();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
      headers: {
        field
      }
    };
    await sut.request(httpRequest);
    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      field,
      'x-access-token': storageValue.accessToken,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Authorization: `Bearer ${storageValue.user.spotify?.accessToken}`
    });
  });

  test('should return the same result as HttpClient', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual(httpClientSpy.response);
  });
});
