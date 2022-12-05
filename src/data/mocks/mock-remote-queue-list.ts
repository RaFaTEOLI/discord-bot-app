import { RemoteLoadQueue } from '@/data/usecases';
import { faker } from '@faker-js/faker';

export const mockRemoteQueueModel = (): RemoteLoadQueue.Model => ({
  name: faker.name.middleName(),
  author: faker.name.firstName(),
  duration: faker.date.recent().toString(),
  thumbnail: faker.internet.avatar(),
  url: faker.internet.url(),
  id: faker.datatype.uuid()
});

export const mockRemoteQueueListModel = (): RemoteLoadQueue.Model[] => [
  mockRemoteQueueModel(),
  mockRemoteQueueModel(),
  mockRemoteQueueModel()
];
