import CryptoJS from 'crypto-js';
import { CryptoJSAdapter } from './cryptojs-adapter';
import { faker } from '@faker-js/faker';
import { describe, test, expect, vi } from 'vitest';

vi.mock('crypto-js', async () => {
  return {
    default: {
      AES: {
        encrypt(value: string): string {
          return 'encrypted_value';
        },
        decrypt(value: string): string {
          return 'decrypted_value';
        }
      },
      enc: {
        Utf8: 'utf-8'
      }
    }
  };
});

type SutTypes = {
  sut: CryptoJSAdapter;
  secret: string;
};

const makeSut = (): SutTypes => {
  const secret = faker.datatype.uuid();
  const sut = new CryptoJSAdapter(secret);
  return {
    sut,
    secret
  };
};

describe('CryptoJS Adapter', () => {
  describe('encrypt()', () => {
    test('should call encrypt with correct values', () => {
      const { sut, secret } = makeSut();
      const encryptSpy = vi.spyOn(CryptoJS.AES, 'encrypt');
      const valueToEncrypt = faker.lorem.words();
      sut.encrypt(valueToEncrypt);
      expect(encryptSpy).toHaveBeenCalledWith(valueToEncrypt, secret);
    });

    test('should return the encrypted value on encrypt success', () => {
      const { sut } = makeSut();
      const encryptedValue = sut.encrypt(faker.lorem.words());
      expect(encryptedValue).toBe('encrypted_value');
    });

    test('should throw an exception if encrypt throws an exception', () => {
      const { sut } = makeSut();
      vi.spyOn(CryptoJS.AES, 'encrypt').mockImplementationOnce(() => new Error() as never);
      const error = sut.encrypt(faker.lorem.words());
      expect(error).toBe('Error');
    });
  });

  describe('decrypt()', () => {
    test('should call decrypt with correct values', () => {
      const { sut, secret } = makeSut();
      const decryptSpy = vi.spyOn(CryptoJS.AES, 'decrypt');
      const valueToDecrypt = faker.lorem.words();
      sut.decrypt(valueToDecrypt);
      expect(decryptSpy).toHaveBeenCalledWith(valueToDecrypt, secret);
    });

    test('should return the decrypted value on decrypt success', () => {
      const { sut } = makeSut();
      const decryptedValue = sut.decrypt(faker.lorem.words());
      expect(decryptedValue).toBe('decrypted_value');
    });

    test('should throw an exception if decrypt throws an exception', () => {
      const { sut } = makeSut();
      vi.spyOn(CryptoJS.AES, 'decrypt').mockImplementationOnce(() => new Error() as never);
      const error = sut.decrypt(faker.lorem.words());
      expect(error).toBe('Error');
    });
  });
});
