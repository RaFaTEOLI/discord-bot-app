import { LoadCommands } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockCommandModel = (): LoadCommands.Model => ({
  id: faker.datatype.uuid(),
  command: faker.word.verb(),
  description: faker.lorem.words(3),
  dispatcher: faker.helpers.arrayElement(['client', 'message']),
  type: faker.helpers.arrayElement(['music', 'action', 'message']),
  response: faker.lorem.words(2)
});

export const mockCommandListModel = (): LoadCommands.Model[] => [mockCommandModel(), mockCommandModel(), mockCommandModel()];

export class LoadCommandsSpy implements LoadCommands {
  callsCount = 0;
  commands = mockCommandListModel();

  async all(): Promise<LoadCommands.Model[]> {
    this.callsCount++;
    return Promise.resolve(this.commands);
  }
}