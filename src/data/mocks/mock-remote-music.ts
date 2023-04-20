import { RemoteLoadMusic } from '@/data/usecases';
import { SpotifySearchModel } from '@/domain/models';
import { faker } from '@faker-js/faker';

export const mockRemoteMusicModel = (): RemoteLoadMusic.Model => ({
  id: faker.datatype.uuid(),
  name: `${faker.name.firstName()} - ${faker.name.firstName()}`,
  startedAt: Math.floor(Date.now() / 1000),
  duration: `${faker.random.numeric()}:${faker.random.numeric(2)}`
});

export const mockRemoteSpotifySearchModel = (): SpotifySearchModel => ({
  artists: {
    href: faker.internet.url(),
    items: [
      {
        external_urls: { spotify: faker.internet.url() },
        followers: {
          href: null,
          total: Number(faker.random.numeric(3))
        },
        genres: [],
        href: faker.internet.url(),
        id: faker.datatype.uuid(),
        images: [
          {
            height: Number(faker.random.numeric(3)),
            url: faker.internet.avatar(),
            width: Number(faker.random.numeric(3))
          }
        ],
        name: faker.name.firstName(),
        popularity: Number(faker.random.numeric(2)),
        type: faker.helpers.arrayElement(['album', 'track']),
        uri: faker.datatype.uuid()
      }
    ],
    limit: 1,
    next: null,
    offset: 0,
    previous: null,
    total: 1
  },
  tracks: {
    href: faker.internet.url(),
    items: [
      {
        album: {
          album_type: 'single',
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
          external_urls: { spotify: faker.internet.url() },
          href: faker.internet.url(),
          id: faker.datatype.uuid(),
          images: [
            {
              height: Number(faker.random.numeric(3)),
              url: faker.internet.avatar(),
              width: Number(faker.random.numeric(3))
            }
          ],
          name: faker.name.firstName(),
          release_date: faker.date.past().toString(),
          release_date_precision: 'day',
          total_tracks: Number(faker.random.numeric(2)),
          type: 'artist',
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
    limit: 1,
    next: null,
    offset: 0,
    previous: null,
    total: 1
  }
});
