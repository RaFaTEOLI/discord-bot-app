import { LoadQueue } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockQueueModel = (): LoadQueue.Model => ({
  name: faker.name.middleName(),
  author: faker.name.firstName(),
  duration: faker.date.recent().toString(),
  thumbnail: faker.internet.avatar(),
  url: faker.internet.url(),
  id: faker.datatype.uuid()
});

export class LoadQueueSpy implements LoadQueue {
  callsCount = 0;
  queue = [
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel(),
    mockQueueModel()
  ];

  async all(): Promise<LoadQueue.Model[]> {
    this.callsCount++;
    return Promise.resolve(this.queue);
  }
}
