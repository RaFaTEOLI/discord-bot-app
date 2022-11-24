import { LoadMusic } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockMusicModel = (): LoadMusic.Model => ({
  id: faker.datatype.uuid(),
  name: `${faker.name.firstName()} - ${faker.name.firstName()}`,
  startedAt: Math.floor(Date.now() / 1000)
});

export class LoadMusicSpy implements LoadMusic {
  callsCount = 0;
  music = mockMusicModel();

  async load(): Promise<LoadMusic.Model> {
    this.callsCount++;
    return Promise.resolve(this.music);
  }
}