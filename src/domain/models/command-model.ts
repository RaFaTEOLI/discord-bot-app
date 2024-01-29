export enum ApplicationCommandType {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3
}

export enum CommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4, // Any integer between -2^53 and 2^53
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7, // Includes all channel types + categories
  ROLE = 8,
  MENTIONABLE = 9, // Includes users and roles
  NUMBER = 10, // Any double between -2^53 and 2^53
  ATTACHMENT = 11 // Attachment object
}

export enum CommandDiscordStatus {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  FAILED = 'FAILED'
}

export type CommandModel = {
  id: string;
  command: string;
  description: string;
  type: string;
  dispatcher: string;
  response: string;
  discordType: ApplicationCommandType;
  discordStatus?: CommandDiscordStatus;
  options?: Array<{
    name: string;
    description: string;
    type: CommandOptionType;
    required: boolean;
    choices?: Array<{
      name: string;
      value: string;
    }>;
  }>;
};
