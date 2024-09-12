import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/cache';

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(private readonly getStorage: GetStorage, private readonly httpClient: HttpClient) {}

  async request(data: HttpRequest): Promise<HttpResponse> {
    const accessToken = this.getStorage.get(process.env.VITE_LOCAL_STORAGE_TOKEN_IDENTIFIER as string) as string;

    if (accessToken) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          ...(!data.url.includes('discord.com') && { 'x-access-token': accessToken })
        })
      });
    }
    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}
