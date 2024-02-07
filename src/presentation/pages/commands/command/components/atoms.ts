import { ApplicationCommandType, CommandModel } from '@/domain/models';
import { atom } from 'recoil';

export const types = [
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
];

export const dispatchers = [
  {
    label: 'Client',
    value: 'client'
  },
  {
    label: 'Message',
    value: 'message'
  }
];

export const applicationCommandTypes = [
  {
    label: 'CHAT_INPUT',
    value: '1',
    description: 'Slash commands; a text-based command that shows up when a user types /'
  },
  {
    label: 'USER',
    value: '2',
    description: 'A UI-based command that shows up when you right click or tap on a user'
  },
  {
    label: 'MESSAGE',
    value: '3',
    description: 'A UI-based command that shows up when you right click or tap on a message'
  }
];

export const commandOptionTypes = [
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
];

export const commandState = atom({
  key: 'commandState',
  default: {
    reload: new Date(),
    command: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' } as CommandModel,
    isLoading: true,
    error: '',
    types,
    dispatchers,
    applicationCommandTypes,
    commandOptionTypes,
    disabledForm: false,
    discordType: null as ApplicationCommandType | null
  }
});
