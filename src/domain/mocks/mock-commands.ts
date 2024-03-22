import { DeleteCommand, LoadCommands, RunCommand, SaveCommand, LoadCommandById } from '@/domain/usecases';
import { faker } from '@faker-js/faker';
import { ApplicationCommandType, CommandDiscordStatus, CommandOptionType } from '../models';

export const mockApplicationCommandDiscordType = (): ApplicationCommandType =>
  faker.helpers.arrayElement([
    ApplicationCommandType.CHAT_INPUT,
    ApplicationCommandType.MESSAGE,
    ApplicationCommandType.USER
  ]);

const mockCommandOptionDiscordType = (): CommandOptionType =>
  faker.helpers.arrayElement([
    CommandOptionType.SUB_COMMAND,
    CommandOptionType.SUB_COMMAND_GROUP,
    CommandOptionType.STRING,
    CommandOptionType.INTEGER,
    CommandOptionType.BOOLEAN,
    CommandOptionType.USER,
    CommandOptionType.CHANNEL,
    CommandOptionType.ROLE,
    CommandOptionType.MENTIONABLE,
    CommandOptionType.NUMBER,
    CommandOptionType.ATTACHMENT
  ]);

export const mockCommandModel = (
  type = faker.helpers.arrayElement(['music', 'action', 'message']),
  discordStatusReceived = false
): LoadCommands.Model => ({
  id: faker.datatype.uuid(),
  command: faker.word.verb(),
  description: faker.lorem.words(3),
  dispatcher: faker.helpers.arrayElement(['client', 'message']),
  type,
  response: faker.lorem.words(2),
  discordType: mockApplicationCommandDiscordType(),
  options: [
    {
      name: faker.word.verb(),
      description: faker.lorem.words(3),
      required: faker.datatype.boolean(),
      type: mockCommandOptionDiscordType()
    }
  ],
  ...(discordStatusReceived && { discordStatus: CommandDiscordStatus.RECEIVED })
});

export const mockSaveCommandParams = (withOptions?: boolean, discordStatusReceived = false): SaveCommand.Params => {
  const type = faker.helpers.arrayElement(['music', 'action', 'message']);
  return {
    command: faker.word.verb(),
    description: faker.lorem.words(3),
    dispatcher: faker.helpers.arrayElement(['client', 'message']),
    type,
    response: faker.lorem.words(2),
    discordType: mockApplicationCommandDiscordType(),
    ...(discordStatusReceived && { discordStatus: CommandDiscordStatus.RECEIVED }),
    ...(withOptions
      ? {
          options: [
            {
              name: faker.word.verb(),
              description: faker.lorem.words(3),
              required: faker.datatype.boolean(),
              type: mockCommandOptionDiscordType()
            }
          ]
        }
      : { options: [] })
  };
};

export const mockCommandListModel = (): LoadCommands.Model[] => [
  mockCommandModel('action'),
  mockCommandModel('music'),
  mockCommandModel('message'),
  mockCommandModel(undefined, true)
];

export class LoadCommandsSpy implements LoadCommands {
  callsCount = 0;
  commands = mockCommandListModel();

  async all(): Promise<LoadCommands.Model[]> {
    this.callsCount++;
    return Promise.resolve(this.commands);
  }
}

export class SaveCommandSpy implements SaveCommand {
  callsCount = 0;
  params: SaveCommand.Params | undefined;
  command = mockCommandModel();

  async save(params: SaveCommand.Params): Promise<void> {
    this.callsCount++;
    this.params = params;
    return Promise.resolve();
  }
}

export class DeleteCommandSpy implements DeleteCommand {
  callsCount = 0;
  commandId: string | undefined;

  async delete(commandId: string): Promise<void> {
    this.callsCount++;
    this.commandId = commandId;
    return Promise.resolve();
  }
}

export class RunCommandSpy implements RunCommand {
  callsCount = 0;
  command: string | undefined;

  async run(command: string): Promise<void> {
    this.callsCount++;
    this.command = command;
    return Promise.resolve();
  }
}

export class LoadCommandByIdSpy implements LoadCommandById {
  callsCount = 0;
  commandId = '';
  command = mockCommandModel();

  async loadById(id: string): Promise<LoadCommandById.Model> {
    this.callsCount++;
    this.commandId = id;
    return Promise.resolve(this.command);
  }
}
