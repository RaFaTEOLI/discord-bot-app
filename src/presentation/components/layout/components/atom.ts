import { MusicModel, QueueModel } from '@/domain/models';
import { atom } from 'recoil';

export const playerState = atom({
  key: 'playerState',
  default: {
    music: {
      id: '',
      name: null,
      startedAt: 1667828719
    } as unknown as MusicModel,
    queue: [] as unknown as QueueModel[]
  }
});
