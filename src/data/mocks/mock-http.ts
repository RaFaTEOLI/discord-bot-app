/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import { HttpRequest, HttpResponse, HttpStatusCode, HttpClient } from '@/data/protocols/http';

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
  body: faker.datatype.json(),
  headers: faker.datatype.json()
});

export const mockHttpRequestWithParams = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete']),
  body: faker.datatype.json(),
  headers: faker.datatype.json(),
  params: {
    [faker.database.column()]: faker.random.word()
  }
});

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string;
  method?: string;
  body?: any;
  headers?: any;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.success
  };

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.headers = data.headers;
    return Promise.resolve(this.response);
  }
}
