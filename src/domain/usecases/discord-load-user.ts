import { DiscordUserModel } from '@/domain/models';

export interface DiscordLoadUser {
  load: (accessToken: string) => Promise<DiscordLoadUser.Model>;
}

export namespace DiscordLoadUser {
  export type Model = DiscordUserModel;
}
