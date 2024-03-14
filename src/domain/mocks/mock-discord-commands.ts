import { mockRemoteDiscordCommandModel } from '@/data/mocks';
import { LoadDiscordCommands } from '../usecases';

export const mockDiscordCommandListModel = (): LoadDiscordCommands.Model => [
  mockRemoteDiscordCommandModel(),
  mockRemoteDiscordCommandModel(),
  mockRemoteDiscordCommandModel(false)
];

export class LoadDiscordCommandsSpy implements LoadDiscordCommands {
  callsCount = 0;
  commands = mockDiscordCommandListModel();

  async all(): Promise<LoadDiscordCommands.Model> {
    this.callsCount++;
    return Promise.resolve(this.commands);
  }
}
