import { faker } from '@faker-js/faker';
import { LoadUser } from '@/domain/usecases';

export const mockSpotifyUser = (): LoadUser.Model => ({
  display_name: faker.name.fullName(),
  email: faker.internet.email(),
  id: faker.datatype.uuid(),
  country: 'BR',
  external_urls: [
    {
      spotify: faker.internet.url()
    }
  ],
  images: [
    {
      height: null,
      url: faker.internet.url(),
      width: null
    }
  ],
  product: 'premium'
});
