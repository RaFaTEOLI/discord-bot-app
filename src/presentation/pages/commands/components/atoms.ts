import { CommandModel } from '@/domain/models';
import { atom } from 'recoil';

export const commandsState = atom({
  key: 'commandsState',
  default: {
    commands: [
      {
        id: 1,
        command: 'rubeo',
        description: 'Bot description',
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 2,
        command: 'play <link>',
        description: 'Command to play music',
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 3,
        command: 'pause',
        description: 'Command to pause the music',
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 4,
        command: 'resume',
        description: 'Command to resume the music',
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 5,
        command: 'shuffle',
        description: 'Command to shuffle the music',
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 6,
        command: 'playing',
        description: "Command to see what's playing",
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 7,
        command: 'playlist <link>',
        description: 'Command to add a playlist to the queue',
        type: 'action',
        dispatcher: 'message'
      },
      {
        id: 8,
        command: 'nostalgy',
        description: 'Command to play Old But Old playlist',
        type: 'music',
        dispatcher: 'client',
        response: 'https://open.spotify.com/playlist/0aIH01fiJYjb23FCGuleNf?si=bdb26051d4ec47eb'
      }
    ] as unknown as CommandModel[],
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    selectedCommand: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' } as CommandModel,
    isLoading: false,
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
