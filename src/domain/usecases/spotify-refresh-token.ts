export interface SpotifyRefreshToken {
  refresh: (params: SpotifyRefreshToken.Params) => Promise<{ accessToken: string }>;
}

export namespace SpotifyRefreshToken {
  export type Params = {
    refreshToken: string;
    encodedAuthorization: string;
  };
  export type Model = { accessToken: string };
}
