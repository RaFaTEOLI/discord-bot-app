import { SpotifyPlaylistModel, SpotifyTrackModel } from '@/domain/models';
import { atom } from 'recoil';

export const userPlaylistState = atom({
  key: 'userPlaylistState',
  default: {
    isLoading: true,
    reload: false,
    error: '',
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    playlist: undefined as unknown as SpotifyPlaylistModel,
    filteredTracks: [] as SpotifyTrackModel[]
  }
});
