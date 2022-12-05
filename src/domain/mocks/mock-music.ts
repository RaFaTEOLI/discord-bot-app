import { LoadMusic } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockMusicModel = (): LoadMusic.Model => ({
  id: faker.datatype.uuid(),
  name: `${faker.name.firstName()} - ${faker.name.firstName()}`,
  duration: faker.date.recent().toString(),
  startedAt: Math.floor(Date.now() / 1000),
  thumbnail: faker.internet.avatar()
});

export class LoadMusicSpy implements LoadMusic {
  callsCount = 0;
  music = mockMusicModel();

  async load(): Promise<LoadMusic.Model> {
    this.callsCount++;
    return Promise.resolve(this.music);
  }
}
