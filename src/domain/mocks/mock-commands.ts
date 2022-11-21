import { LoadCommands, SaveCommand } from '@/domain/usecases';
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
