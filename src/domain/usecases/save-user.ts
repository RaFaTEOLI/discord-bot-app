import { UserModel } from '@/domain/models';

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export interface SaveUser {
  save: (params: SaveUser.Params) => Promise<void>;
}

export namespace SaveUser {
  export type Params = Partial<Omit<UserModel, 'id'>>;

  export type Model = UserModel;
}
