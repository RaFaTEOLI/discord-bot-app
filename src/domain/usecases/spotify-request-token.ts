import { AccountModel } from '@/domain/models';

export interface SpotifyAuthenticate {
  request: (params: SpotifyAuthenticate.Params) => Promise<SpotifyAuthenticate.Model>;
}

export namespace SpotifyAuthenticate {
  export type Params = {
    code: string;
    state: string;
  };
  export type Model = AccountModel;
}
