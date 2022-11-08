import axios from 'axios';
import { faker } from '@faker-js/faker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockHttpResponse = (): any => ({
  data: faker.datatype.json(),
  status: faker.datatype.number()
});

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse());
  return mockedAxios;
};
