export type AccountModel = {
  accessToken: string;
  user: {
    name: string;
    email: string;
    id: string;
    spotify?: {
      accessToken: string;
      refreshToken: string;
    };
  };
};
