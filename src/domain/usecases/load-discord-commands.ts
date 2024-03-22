import { DiscordCommandModel } from '../models';

export interface LoadDiscordCommands {
  all: () => Promise<LoadDiscordCommands.Model>;
}

export namespace LoadDiscordCommands {
  export type Model = DiscordCommandModel[];
}
