import { HttpRequest, HttpResponse, HttpClient } from '@/data/protocols/http';
import axios, { AxiosResponse } from 'axios';

export class AxiosHttpClient implements HttpClient {
  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers
      });
    } catch (error: any) {
      console.error(error);
      if (error.code === 'ECONNREFUSED') {
        console.error('Unable to connect to server');
        return {
          statusCode: 500,
          body: {
            error: 'Unable to connect to server'
          }
        };
      }
      if (error.code === 'ERR_NETWORK') {
        console.error('Unable to connect to server');
        return {
          statusCode: 500,
          body: {
            error: 'Unable to connect to server'
          }
        };
      }
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    };
  }
}
