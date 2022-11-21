export type AccountModel = {
  accessToken: string;
  user: {
    name: string;
    email: string;
    id: string;
    role?: string;
    spotify?: {
      avatarUrl?: string;
      accessToken: string;
      refreshToken: string;
    };
  };
};
