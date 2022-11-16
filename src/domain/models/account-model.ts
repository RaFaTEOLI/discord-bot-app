export type AccountModel = {
  accessToken: string;
  user: {
    name: string;
    email: string;
    id: string;
    spotify?: {
      avatarUrl?: string;
      accessToken: string;
      refreshToken: string;
    };
  };
};
