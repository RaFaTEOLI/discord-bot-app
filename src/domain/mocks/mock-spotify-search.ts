import { SpotifySearch } from '@/domain/usecases';
import { SpotifySearchModel } from '@/domain/models';
import { faker } from '@faker-js/faker';

export const mockSpotifySearch = (): SpotifySearchModel => ({
  artists: {
    href: faker.internet.url(),
    items: [
      {
        external_urls: {
          spotify: faker.internet.url()
        },
        followers: {
          href: null,
          total: faker.datatype.number(100)
        },
        genres: [],
        href: faker.internet.url(),
        id: faker.datatype.uuid(),
        images: [
          {
            height: faker.datatype.number(100),
            url: faker.internet.avatar(),
            width: faker.datatype.number(100)
          }
        ],
        name: faker.name.firstName(),
        popularity: faker.datatype.number(100),
        type: 'artist',
        uri: faker.datatype.uuid()
      }
    ],
    limit: 20,
    next: faker.internet.url(),
    offset: 0,
    previous: null,
    total: faker.datatype.number(100)
  },
  tracks: {
    href: faker.internet.url(),
    items: [
      {
        album: {
          album_type: 'album',
          artists: [
            {
              external_urls: {
                spotify: faker.internet.url()
              },
              href: faker.internet.url(),
              id: faker.datatype.uuid(),
              name: faker.name.firstName(),
              type: 'artists',
              uri: faker.datatype.uuid()
            }
          ],
          external_urls: {
            spotify: faker.internet.url()
          },
          href: faker.internet.url(),
          id: faker.datatype.uuid(),
          images: [
            {
              height: faker.datatype.number(100),
              url: faker.internet.avatar(),
              width: faker.datatype.number(100)
            }
          ],
          name: faker.name.firstName(),
          release_date: faker.date.recent().toString(),
          release_date_precision: 'day',
          total_tracks: faker.datatype.number(100),
          type: 'album',
          uri: faker.datatype.uuid()
        },
        artists: [
          {
            external_urls: {
              spotify: faker.internet.url()
            },
            href: faker.internet.url(),
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            type: 'artist',
            uri: faker.datatype.uuid()
          }
        ],
        disc_number: faker.datatype.number(100),
        duration_ms: faker.datatype.number(100),
        explicit: false,
        external_ids: {
          isrc: faker.datatype.uuid()
        },
        external_urls: {
          spotify: faker.internet.url()
        },
        href: faker.internet.url(),
        id: faker.datatype.uuid(),
        is_local: false,
        is_playable: true,
        name: faker.name.lastName(),
        popularity: faker.datatype.number(100),
        preview_url: faker.internet.url(),
        track_number: faker.datatype.number(100),
        type: 'track',
        uri: faker.datatype.uuid()
      }
    ],
    limit: 20,
    next: faker.internet.url(),
    offset: 0,
    previous: null,
    total: faker.datatype.number(100)
  }
});

export class SpotifySearchSpy implements SpotifySearch {
  spotifySearch = mockSpotifySearch();
  callsCount = 0;

  async search(value: string): Promise<SpotifySearch.Model> {
    this.callsCount++;
    return Promise.resolve(this.spotifySearch);
  }
}
