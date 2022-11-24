import { RemoteLoadMusic } from '@/data/usecases';
import { faker } from '@faker-js/faker';

export const mockRemoteMusicModel = (): RemoteLoadMusic.Model => ({
  id: faker.datatype.uuid(),
  name: `${faker.name.firstName()} - ${faker.name.firstName()}`,
  startedAt: Math.floor(Date.now() / 1000)
});
