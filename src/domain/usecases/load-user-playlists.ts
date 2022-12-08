import { SpotifyPlaylistModel } from '@/domain/models';
export interface LoadUserPlaylists {
  all: () => Promise<LoadUserPlaylists.Model[]>;
}

export namespace LoadUserPlaylists {
  export type Model = SpotifyPlaylistModel;
}