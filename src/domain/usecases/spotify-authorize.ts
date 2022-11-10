export interface SpotifyAuthorize {
  authorize: () => Promise<string>;
}

export namespace SpotifyAuthorize {
  export type Params = {
    responseType: string;
    clientId: string;
    scope: string;
    redirectUri: string;
    state: string;
  };
}
