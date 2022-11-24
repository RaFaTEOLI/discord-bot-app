import { AxiosHttpClient } from './axios-http-client';
import { mockAxios, mockHttpResponse } from '@/infra/mocks';
import { mockHttpRequest, mockHttpRequestWithParams } from '@/data/mocks';
import axios from 'axios';

jest.mock('axios');

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: jest.Mocked<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();
  return {
    sut,
    mockedAxios
  };
};

describe('AxiosHttpClient', () => {
  test('should call axios with correct values', async () => {
    const request = mockHttpRequest();
    const { sut, mockedAxios } = makeSut();
    await sut.request(request);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method
    });
  });

  test('should call axios with correct values and query params', async () => {
    const request = mockHttpRequestWithParams();
    const { sut, mockedAxios } = makeSut();
    await sut.request(request);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method,
      params: request.params
    });
  });

  test('should return correct response', async () => {
    const { sut, mockedAxios } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    const axiosResponse = await mockedAxios.request.mock.results[0].value;
    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    });
  });

  test('should return correct error', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse()
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });

  test('should return unable to connect error', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      code: 'ECONNREFUSED'
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });

  test('should return unable to connect error', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      code: 'ERR_NETWORK'
    });
    const promise = sut.request(mockHttpRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });
});
