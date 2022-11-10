import { SpotifyAccessModel } from '@/domain/models';

export interface SpotifyRequestToken {
  request: (params: SpotifyRequestToken.Params) => Promise<SpotifyRequestToken.Model>;
}

export namespace SpotifyRequestToken {
  export type Params = {
    code: string;
    state: string;
  };
  export type Model = SpotifyAccessModel;
}
