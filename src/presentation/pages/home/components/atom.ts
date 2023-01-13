import { ServerModel } from '@/domain/models';
import { atom } from 'recoil';

export const homeState = atom({
  key: 'homeState',
  default: {
    isLoading: true,
    reload: false,
    error: '',
    server: undefined as unknown as ServerModel
  }
});
