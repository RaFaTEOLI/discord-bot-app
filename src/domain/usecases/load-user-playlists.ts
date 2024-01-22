import { SpotifyPlaylistListModel } from '@/domain/models';
export interface LoadUserPlaylists {
  all: (offset?: number) => Promise<LoadUserPlaylists.Model>;
}

export namespace LoadUserPlaylists {
  export type Model = SpotifyPlaylistListModel;
}
