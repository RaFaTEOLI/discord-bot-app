/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetStorage, SetStorage } from '@/data/protocols/cache';
import { faker } from '@faker-js/faker';

export class GetStorageSpy implements GetStorage {
  key: string | undefined;
  value: any = faker.datatype.json();

  get(key: string): any {
    this.key = key;
    return this.value;
  }
}

export class SetStorageSpy implements SetStorage {
  key: string | undefined;
  value: any = faker.datatype.json();

  set(key: string, value: string | undefined): void {
    this.key = key;
    this.value = value;
  }
}
