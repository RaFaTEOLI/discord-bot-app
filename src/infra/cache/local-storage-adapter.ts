/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStorage } from '@/data/protocols/cache';

export class LocalStorageAdapter implements SetStorage {
  set(key: string, value: string | null): void {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }

  get(key: string): string {
    // eslint-disable-next-line
    // @ts-ignore
    return localStorage.getItem(key);
  }
}
