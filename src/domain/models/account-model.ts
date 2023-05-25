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
    discord?: {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
    };
  };
};
