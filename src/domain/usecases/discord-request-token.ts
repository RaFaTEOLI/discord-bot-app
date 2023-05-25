import { DiscordAccessModel } from '@/domain/models';

export interface DiscordAuthenticate {
  request: (params: DiscordAuthenticate.Params) => Promise<DiscordAuthenticate.Model>;
}

export namespace DiscordAuthenticate {
  export type Params = {
    code: string;
  };
  export type Model = DiscordAccessModel;
}
