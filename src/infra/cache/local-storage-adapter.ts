/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStorage } from '@/data/protocols/cache';

export class LocalStorageAdapter implements SetStorage {
  set(key: string, value: object | null): void {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }

  get(key: string): any {
    // eslint-disable-next-line
    // @ts-ignore
    return JSON.parse(localStorage.getItem(key));
  }
}
