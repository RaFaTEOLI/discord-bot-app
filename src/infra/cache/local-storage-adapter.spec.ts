import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter';
import { faker } from '@faker-js/faker';
import 'jest-localstorage-mock';

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should call localStorage.setItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = JSON.parse(faker.datatype.json());
    sut.set(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  test('should call localStorage.removeItem if value is null', () => {
    const sut = makeSut();
    const key = faker.database.column();
    sut.set(key, null);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('should call localStorage.getItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.datatype.json();
    // eslint-disable-next-line
    // @ts-ignore
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(value);
    const obj = sut.get(key);
    expect(obj).toEqual(JSON.parse(value));
    expect(getItemSpy).toHaveBeenCalledWith(key);
  });
});
