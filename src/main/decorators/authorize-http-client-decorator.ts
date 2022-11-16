import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/cache';
import { AccountModel } from '@/domain/models';

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(private readonly getStorage: GetStorage, private readonly httpClient: HttpClient) {}

  async request(data: HttpRequest): Promise<HttpResponse> {
    const account = this.getStorage.get('account') as AccountModel;
    if (account?.accessToken) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          'x-access-token': account.accessToken,
          ...(account.user.spotify?.accessToken && { Authorization: `Bearer ${account.user.spotify.accessToken}` })
        })
      });
    }
    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}
