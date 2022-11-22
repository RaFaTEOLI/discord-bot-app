import { CommandModel } from '@/domain/models';
import { atom } from 'recoil';

export const commandsState = atom({
  key: 'commandsState',
  default: {
    reload: false,
    commands: [] as unknown as CommandModel[],
    filteredCommands: [] as unknown as CommandModel[],
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    selectedCommand: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' } as CommandModel,
    isLoading: true,
    error: '',
    types: [
      {
        label: 'Music',
        value: 'music'
      },
      {
        label: 'Action',
        value: 'action'
      },
      {
        label: 'Message',
        value: 'message'
      }
    ],
    dispatchers: [
      {
        label: 'Client',
        value: 'client'
      },
      {
        label: 'Message',
        value: 'message'
      }
    ],
    disabledForm: false
  }
});
