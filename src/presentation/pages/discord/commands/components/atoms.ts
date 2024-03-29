import { DiscordCommandModel } from '@/domain/models';
import { atom } from 'recoil';

export const discordCommandsState = atom({
  key: 'discordCommandsState',
  default: {
    commands: [] as unknown as DiscordCommandModel[],
    filteredCommands: [] as unknown as DiscordCommandModel[],
    isLoading: true,
    error: '',
    reload: false
  }
});
