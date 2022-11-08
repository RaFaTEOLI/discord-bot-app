import { RemoteAuthentication } from '@/data/usecases';
import { makeAxiosHttpClient, makeApiUrl } from '@/main/factories/http';
import { Authentication } from '@/domain/usecases';

export const makeRemoteAuthentication = (): Authentication => {
  return new RemoteAuthentication(makeApiUrl('/login'), makeAxiosHttpClient());
};
