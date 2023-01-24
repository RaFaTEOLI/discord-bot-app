import { SpotifySearch } from '@/domain/usecases';
import { atom } from 'recoil';

export const searchState = atom({
  key: 'searchState',
  default: {
    isLoading: false,
    error: '',
    value: '',
    search: undefined as unknown as SpotifySearch.Model,
    currentPlay: { url: '', music: false }
  }
});
