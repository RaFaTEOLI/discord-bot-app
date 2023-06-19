export interface SpotifyRefreshToken {
  refresh: (params: SpotifyRefreshToken.Params) => Promise<{ accessToken: string }>;
}

export namespace SpotifyRefreshToken {
  export type Params = {
    refreshToken: string;
  };
  export type Model = { accessToken: string };
}
