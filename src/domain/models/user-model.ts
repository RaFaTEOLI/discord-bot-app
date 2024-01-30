export type UserSpotifyModel = {
  avatarUrl?: string;
  accessToken: string;
  refreshToken: string;
};

export type UserModel = {
  name: string;
  email: string;
  id: string;
  role?: string;
  spotify?: UserSpotifyModel;
  discord?: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
  };
};
