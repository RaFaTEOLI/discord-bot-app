import { SpotifyUserModel } from '@/domain/models';
export interface LoadUser {
  load: () => Promise<LoadUser.Model>;
}

export namespace LoadUser {
  export type Model = SpotifyUserModel;
}
