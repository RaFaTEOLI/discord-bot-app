import { ApplicationCommandType, CommandOptionType } from './command-model';

export type DiscordCommandModel = {
  id: string;
  application_id: string;
  version: string;
  default_member_permissions: string | null;
  type: ApplicationCommandType;
  name: string;
  description: string;
  dm_permissions: boolean;
  contexts: null;
  integration_types: number[];
  options?: Array<{
    type: CommandOptionType;
    name: string;
    description: string;
    required: boolean;
  }>;
  nsfw: boolean;
};
