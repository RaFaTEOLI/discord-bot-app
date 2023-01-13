import { LoadServer } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

const mockServerMember = (status = faker.helpers.arrayElement(['online', 'dnd']), showGame = true): any => ({
  id: faker.datatype.uuid(),
  username: faker.internet.userName(),
  discriminator: '0000',
  avatar: null,
  status,
  ...(showGame && {
    game: {
      name: faker.lorem.word()
    }
  }),
  avatar_url: faker.internet.avatar()
});

const createArray = (length: number, factoryFunction: (status?: string, showGame?: boolean) => any): any => {
  const createdArray = [
    factoryFunction('online'),
    factoryFunction('dnd'),
    factoryFunction('online', false),
    factoryFunction('dnd', false)
  ];
  for (let i = 0; i < length; i++) {
    createdArray.push(factoryFunction());
  }
  return createdArray;
};

export const mockServerModel = (): LoadServer.Model => ({
  id: faker.datatype.uuid(),
  name: `${faker.name.firstName()} - ${faker.name.firstName()}`,
  instant_invite: null,
  channels: [
    {
      id: faker.datatype.uuid(),
      name: faker.lorem.word(),
      position: 0
    }
  ],
  members: createArray(10, mockServerMember),
  presence_count: 1
});

export class LoadServerSpy implements LoadServer {
  callsCount = 0;
  server = mockServerModel();

  async load(): Promise<LoadServer.Model> {
    this.callsCount++;
    return Promise.resolve(this.server);
  }
}
