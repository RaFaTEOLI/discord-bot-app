import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter';
import { faker } from '@faker-js/faker';
import 'vitest-localstorage-mock';
import { describe, test, expect, beforeEach, vi } from 'vitest';

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should call localStorage.setItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = JSON.stringify({ test: faker.word.verb() });
    sut.set(key, value);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
  });

  test('should call localStorage.removeItem if value is null', () => {
    const sut = makeSut();
    const key = faker.database.column();
    sut.set(key, null);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('should call localStorage.getItem with correct values', () => {
    // Workaround to fix not being able to spy on localStorage
    const mock = (function () {
      let store: any = {};
      return {
        getItem: function (key: string) {
          return store[key];
        },
        setItem: function (key: string, value: string) {
          store[key] = value.toString();
        },
        clear: function () {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: mock });
    const sut = makeSut();
    const key = faker.database.column();
    const value = JSON.stringify({ test: faker.word.verb() });
    const getItemSpy = vi.spyOn(localStorage, 'getItem').mockReturnValueOnce(value);
    const obj = sut.get(key);
    expect(obj).toEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith(key);
  });
});
