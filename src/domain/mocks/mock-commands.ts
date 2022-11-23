import { DeleteCommand, LoadCommands, RunCommand, SaveCommand } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockCommandModel = (type = faker.helpers.arrayElement(['music', 'action', 'message'])): LoadCommands.Model => ({
  id: faker.datatype.uuid(),
  command: faker.word.verb(),
  description: faker.lorem.words(3),
  dispatcher: faker.helpers.arrayElement(['client', 'message']),
  type,
  response: faker.lorem.words(2)
});

export const mockSaveCommandParams = (): SaveCommand.Params => ({
  command: faker.word.verb(),
  description: faker.lorem.words(3),
  dispatcher: faker.helpers.arrayElement(['client', 'message']),
  type: faker.helpers.arrayElement(['music', 'action', 'message']),
  response: faker.lorem.words(2)
});

export const mockCommandListModel = (): LoadCommands.Model[] => [
  mockCommandModel('action'),
  mockCommandModel('music'),
  mockCommandModel('message')
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
