import { UserModel } from './user-model';

export type AccountModel = {
  accessToken: string;
  user: UserModel;
};
