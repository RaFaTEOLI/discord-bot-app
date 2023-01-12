import { faker } from '@faker-js/faker';
import { LoadPlaylistTracks, LoadUserPlaylists } from '@/domain/usecases';
import { SpotifyPlaylistModel, SpotifyTrackModel, SpotifyPlaylistTrackListModel } from '../models';

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

export const mockSpotifyTrack = (): SpotifyTrackModel => ({
  added_at: faker.date.past().toString(),
  added_by: {
    external_urls: {
      spotify: faker.internet.url()
    },
    href: faker.internet.url(),
    id: faker.datatype.uuid(),
    type: 'user',
    uri: `spotify:user:${faker.datatype.uuid()}`
  },
  is_local: faker.datatype.boolean(),
  primary_color: null,
  track: {
    album: {
      album_type: 'album',
      artists: [
        {
          external_urls: {
            spotify: faker.internet.url()
          },
          href: faker.internet.url(),
          id: faker.datatype.uuid(),
          name: faker.lorem.words(2),
          type: 'user',
          uri: `spotify:user:${faker.datatype.uuid()}`
        }
      ],
      available_markets: ['US', 'BR'],
      external_urls: {
        spotify: faker.internet.url()
      },
      href: faker.internet.url(),
      id: faker.datatype.uuid(),
      images: [
        {
          height: 640,
          url: faker.internet.avatar(),
          width: 640
        },
        {
          height: 300,
          url: faker.internet.avatar(),
          width: 300
        },
        {
          height: 64,
          url: faker.internet.avatar(),
          width: 64
        }
      ],
      name: faker.lorem.words(2),
      release_date: faker.date.past().toString(),
      release_date_precision: 'day',
      total_tracks: faker.random.numeric(2),
      type: 'album',
      uri: `spotify:user:${faker.datatype.uuid()}`
    },
    artists: [
      {
        external_urls: {
          spotify: faker.internet.url()
        },
        href: faker.internet.url(),
        id: faker.datatype.uuid(),
        name: faker.lorem.sentence(2),
        type: 'artist',
        uri: `spotify:user:${faker.datatype.uuid()}`
      }
    ],
    available_markets: ['US', 'BR'],
    disc_number: 1,
    duration_ms: Number(faker.random.numeric(6)),
    episode: faker.datatype.boolean(),
    explicit: faker.datatype.boolean(),
    external_ids: {
      isrc: faker.datatype.uuid()
    },
    external_urls: {
      spotify: faker.internet.url()
    },
    href: faker.internet.url(),
    id: faker.datatype.uuid(),
    is_local: faker.datatype.boolean(),
    name: faker.lorem.words(2),
    popularity: Number(faker.random.numeric(2)),
    preview_url: faker.internet.url(),
    track: faker.datatype.boolean(),
    track_number: Number(faker.random.numeric(2)),
    type: 'track',
    uri: `spotify:track:${faker.datatype.uuid()}`
  },
  video_thumbnail: {
    url: null
  }
});

const createArray = (length: number, factoryFunction: () => any): any => {
  const createdArray = [];
  for (let i = 0; i < length; i++) {
    createdArray.push(factoryFunction());
  }
  return createdArray;
};

export const mockSpotifyPlaylistTracksList = (tracksCount = 100): LoadPlaylistTracks.Model => ({
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
    href: `${faker.internet.url()}/${faker.datatype.uuid()}/tracks?offset=${tracksCount <= 100 ? 0 : 100}&limit=100`,
    items: createArray(tracksCount <= 100 ? tracksCount : 100, mockSpotifyTrack),
    next: tracksCount <= 100 ? null : `${faker.internet.url()}/${faker.datatype.uuid()}/tracks?offset=100&limit=100`,
    offset: tracksCount <= 100 ? 0 : 100,
    previous: null,
    total: createArray(tracksCount <= 100 ? tracksCount : 100, mockSpotifyTrack).length
  },
  type: 'playlist',
  uri: `spotify:playlist:${faker.datatype.uuid()}`
});

export const mockSpotifyPlaylistTracks = (tracksCount = 100): SpotifyPlaylistTrackListModel => ({
  href: `${faker.internet.url()}/${faker.datatype.uuid()}/tracks?offset=${tracksCount <= 100 ? 0 : 100}&limit=100`,
  items: createArray(tracksCount <= 100 ? tracksCount : 100, mockSpotifyTrack),
  next: tracksCount <= 100 ? null : `${faker.internet.url()}/${faker.datatype.uuid()}/tracks?offset=100&limit=100`,
  offset: tracksCount <= 100 ? 0 : 100,
  previous: null,
  total: tracksCount,
  limit: 100
});

export class LoadPlaylistTracksSpy implements LoadPlaylistTracks {
  spotifyUserPlaylists = mockSpotifyPlaylistTracksList();
  callsCount = 0;

  async load(id: string): Promise<LoadPlaylistTracks.Model> {
    this.callsCount++;
    return Promise.resolve(this.spotifyUserPlaylists);
  }
}
