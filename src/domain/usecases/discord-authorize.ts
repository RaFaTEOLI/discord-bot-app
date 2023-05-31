export interface DiscordAuthorize {
  authorize: () => Promise<string>;
}

export namespace DiscordAuthorize {
  export type Params = {
    clientId: string;
    scope: string;
    redirectUri: string;
    responseType: string;
  };
}
