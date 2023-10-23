import axios from 'axios';
import { faker } from '@faker-js/faker';
import { MockedObject } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockHttpResponse = (): any => ({
  data: faker.datatype.json(),
  status: faker.datatype.number()
});

export const mockAxios = (): MockedObject<typeof axios> => {
  const mockedAxios = axios as MockedObject<typeof axios>;
  mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse());
  return mockedAxios;
};
