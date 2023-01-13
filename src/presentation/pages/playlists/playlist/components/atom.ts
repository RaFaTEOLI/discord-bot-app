import { SpotifyPlaylistModel, SpotifyTrackModel } from '@/domain/models';
import { LoadUserById } from '@/domain/usecases';
import { atom } from 'recoil';

export const userPlaylistState = atom({
  key: 'userPlaylistState',
  default: {
    isLoading: true,
    reload: false,
    error: '',
    currentPlay: { url: '', music: false },
    playlist: undefined as unknown as SpotifyPlaylistModel,
    filteredTracks: [] as SpotifyTrackModel[],
    playlistOwner: undefined as unknown as LoadUserById.Model
  }
});
