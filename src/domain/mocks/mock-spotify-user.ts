import { faker } from '@faker-js/faker';
import { LoadUser, LoadUserById } from '@/domain/usecases';

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

export const mockSpotifyUserById = (): LoadUserById.Model => ({
  display_name: faker.name.fullName(),
  id: faker.datatype.uuid(),
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
  ]
});

export class LoadUserSpy implements LoadUser {
  spotifyUser = mockSpotifyUser();
  callsCount = 0;

  async load(): Promise<LoadUser.Model> {
    this.callsCount++;
    return Promise.resolve(this.spotifyUser);
  }
}

export class LoadUserByIdSpy implements LoadUserById {
  spotifyUser = mockSpotifyUserById();
  callsCount = 0;

  async loadById(id: string): Promise<LoadUserById.Model> {
    this.callsCount++;
    return Promise.resolve(this.spotifyUser);
  }
}
