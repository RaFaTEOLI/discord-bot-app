import { HttpClient } from '@/data/protocols/http';
import { SpotifyHttpClientDecorator } from '@/main/decorators';
import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory';
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory';
import { makeApiUrl } from '../http';

export const makeSpotifyHttpClientDecorator = (): HttpClient => {
  return new SpotifyHttpClientDecorator(
    makeLocalStorageAdapter(),
    makeLocalStorageAdapter(),
    makeAxiosHttpClient(),
    makeApiUrl('/spotify/guest-token')
  );
};
