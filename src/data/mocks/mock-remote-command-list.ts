import { RemoteLoadCommands } from '@/data/usecases';
import { mockApplicationCommandDiscordType } from '@/domain/mocks';
import { faker } from '@faker-js/faker';

export const mockRemoteCommandModel = (): RemoteLoadCommands.Model => ({
  id: faker.datatype.uuid(),
  command: faker.word.verb(),
  description: faker.lorem.words(3),
  dispatcher: faker.helpers.arrayElement(['client', 'message']),
  type: faker.helpers.arrayElement(['music', 'action', 'message']),
  response: faker.lorem.words(2),
  discordType: mockApplicationCommandDiscordType()
});

export const mockRemoteCommandListModel = (): RemoteLoadCommands.Model[] => [
  mockRemoteCommandModel(),
  mockRemoteCommandModel(),
  mockRemoteCommandModel()
];
