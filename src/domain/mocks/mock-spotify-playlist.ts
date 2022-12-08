import { faker } from '@faker-js/faker';
import { LoadUserPlaylists } from '@/domain/usecases';
import { SpotifyPlaylistModel } from '../models';

export const mockSpotifyPlaylist = (): SpotifyPlaylistModel => ({
  collaborative: faker.datatype.boolean(),
  description: faker.lorem.sentence(),
  external_urls: {
    spotify: faker.internet.url()
  },
  href: faker.internet.url(),
  id: faker.datatype.uuid(),
  images: [
    {
      height: null,
      url: faker.internet.avatar(),
      width: null
    }
  ],
  name: faker.random.words(2),
  owner: {
    display_name: faker.name.fullName(),
    external_urls: {
      spotify: faker.internet.url()
    },
    href: faker.internet.url(),
    id: faker.datatype.uuid(),
    type: 'user',
    uri: `spotify:user:${faker.datatype.uuid()}`
  },
  primary_color: null,
  public: faker.datatype.boolean(),
  snapshot_id: faker.datatype.uuid(),
  tracks: {
    href: faker.internet.url(),
    total: faker.datatype.number({ min: 1, max: 300 })
  },
  type: 'playlist',
  uri: `spotify:playlist:${faker.datatype.uuid()}`
});

export const mockSpotifyPlaylistList = (): LoadUserPlaylists.Model => ({
  href: `${faker.internet.url()}/?offset=0&limit=50`,
  items: [mockSpotifyPlaylist(), mockSpotifyPlaylist(), mockSpotifyPlaylist(), mockSpotifyPlaylist(), mockSpotifyPlaylist()],
  limit: 50,
  next: null,
  offset: 0,
  previous: null,
  total: 5
});

export class LoadUserPlaylistsSpy implements LoadUserPlaylists {
  spotifyUserPlaylists = mockSpotifyPlaylistList();
  callsCount = 0;

  async all(): Promise<LoadUserPlaylists.Model> {
    this.callsCount++;
    return Promise.resolve(this.spotifyUserPlaylists);
  }
}
