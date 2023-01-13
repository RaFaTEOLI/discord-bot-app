import { SpotifyUserModel } from '@/domain/models';

export interface LoadUserBy {
  loadById: (id: string) => Promise<LoadUserBy.Model>;
}

type SpotifyUserByIdModel = Omit<SpotifyUserModel, 'country' | 'email' | 'explicit_content' | 'product'>;

export namespace LoadUserBy {
  export type Model = SpotifyUserByIdModel;
}
