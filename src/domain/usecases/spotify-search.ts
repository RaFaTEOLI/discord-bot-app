import { SpotifySearchModel } from '@/domain/models';

export interface SpotifySearch {
  search: (value: string) => Promise<SpotifySearch.Model>;
}

export namespace SpotifySearch {
  export type Model = SpotifySearchModel;
}
