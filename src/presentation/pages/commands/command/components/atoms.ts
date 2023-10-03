import { CommandModel } from '@/domain/models';
import { atom } from 'recoil';

export const commandState = atom({
  key: 'commandState',
  default: {
    reload: false,
    command: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' } as CommandModel,
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
    discordTypes: [
      {
        label: 'SUB_COMMAND',
        value: '1'
      },
      {
        label: 'SUB_COMMAND_GROUP',
        value: '2'
      },
      {
        label: 'STRING',
        value: '3'
      },
      {
        label: 'INTEGER',
        value: '4'
      },
      {
        label: 'BOOLEAN',
        value: '5'
      },
      {
        label: 'USER',
        value: '6'
      },
      {
        label: 'CHANNEL',
        value: '7'
      },
      {
        label: 'ROLE',
        value: '8'
      },
      {
        label: 'MENTIONABLE',
        value: '9'
      },
      {
        label: 'NUMBER',
        value: '10'
      },
      {
        label: 'ATTACHMENT',
        value: '11'
      }
    ],
    disabledForm: false
  }
});
