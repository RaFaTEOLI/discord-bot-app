import { DiscordUserModel } from '@/domain/models';

export interface DiscordLoadUser {
  request: (accessToken: string) => Promise<DiscordLoadUser.Model>;
}

export namespace DiscordLoadUser {
  export type Model = DiscordUserModel;
}
