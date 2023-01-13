import { SpotifyUserModel } from '@/domain/models';

export interface LoadUserById {
  loadById: (id: string) => Promise<LoadUserById.Model>;
}

type SpotifyUserByIdModel = Omit<SpotifyUserModel, 'country' | 'email' | 'explicit_content' | 'product'>;

export namespace LoadUserById {
  export type Model = SpotifyUserByIdModel;
}
