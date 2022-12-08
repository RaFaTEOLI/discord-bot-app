import { SpotifyPlaylistModel } from '@/domain/models';
import { atom } from 'recoil';

export const userPlaylistsState = atom({
  key: 'userPlaylistsState',
  default: {
    isLoading: true,
    reload: false,
    error: '',
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    playlists: [] as SpotifyPlaylistModel[],
    filteredPlaylists: [] as SpotifyPlaylistModel[]
  }
});
