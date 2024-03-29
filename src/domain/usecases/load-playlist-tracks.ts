import { SpotifyPlaylistModel } from '@/domain/models';

export interface LoadPlaylistTracks {
  load: (id: string) => Promise<LoadPlaylistTracks.Model>;
}

export namespace LoadPlaylistTracks {
  export type Model = SpotifyPlaylistModel;
}
