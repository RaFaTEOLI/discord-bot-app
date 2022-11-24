import { RemoteLoadMusic } from '@/data/usecases';
import { SpotifySearchModel } from '@/domain/models';
import { faker } from '@faker-js/faker';

export const mockRemoteMusicModel = (): RemoteLoadMusic.Model => ({
  id: faker.datatype.uuid(),
  name: `${faker.name.firstName()} - ${faker.name.firstName()}`,
  startedAt: Math.floor(Date.now() / 1000)
});

export const mockRemoteSpotifySearchModel = (): SpotifySearchModel => ({
  artists: {
    items: [
      {
        images: [
          {
            height: faker.random.numeric(3),
            url: faker.internet.avatar(),
            width: faker.random.numeric(3)
          }
        ]
      }
    ]
  },
  tracks: {
    items: [
      {
        album: {
          images: [
            {
              height: faker.random.numeric(3),
              url: faker.internet.avatar(),
              width: faker.random.numeric(3)
            }
          ]
        }
      }
    ]
  }
});
