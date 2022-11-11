export type AccountModel = {
  accessToken: string;
  name: string;
  spotify?: {
    accessToken: string;
    refreshToken: string;
  };
};
