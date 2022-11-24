import { MusicModel } from '@/domain/models';
import { atom } from 'recoil';

export const musicState = atom({
  key: 'musicState',
  default: {
    id: '',
    name: null,
    startedAt: 1667828719
  } as unknown as MusicModel
});
