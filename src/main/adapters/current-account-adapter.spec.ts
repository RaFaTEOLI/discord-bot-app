import { setCurrentAccountAdapter, getCurrentAccountAdapter } from '@/main/adapters';
import { mockAccountModel } from '@/domain/mocks';
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter';
import { describe, test, expect, vi } from 'vitest';

const mockAccount = JSON.stringify(mockAccountModel());

vi.mock('@/infra/cache/local-storage-adapter');
vi.mock('crypto-js', async () => {
  return {
    default: {
      AES: {
        encrypt(value: string): string {
          return 'encrypted_value';
        },
        decrypt(value: string): string {
          return mockAccount;
        }
      },
      enc: {
        Utf8: 'utf-8'
      }
    }
  };
});

describe('CurrentAccountAdapter', () => {
  test('should call LocalStorageAdapter.set with correct values', () => {
    const account = mockAccountModel();
    const setSpy = vi.spyOn(LocalStorageAdapter.prototype, 'set');
    setCurrentAccountAdapter(account);
    expect(setSpy).toHaveBeenCalledWith(process.env.VITE_LOCAL_STORAGE_ACCOUNT_IDENTIFIER as string, 'encrypted_value');
  });

  test('should call LocalStorageAdapter.get with correct values', () => {
    const getSpy = vi.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(mockAccount);
    const account = getCurrentAccountAdapter();
    expect(getSpy).toHaveBeenCalledWith(process.env.VITE_LOCAL_STORAGE_ACCOUNT_IDENTIFIER as string);
    expect(account).toEqual(JSON.parse(mockAccount));
  });

  test('should return undefined if LocalStorageAdapter.get returns null', () => {
    vi.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(null as any);
    const account = getCurrentAccountAdapter();
    expect(account).toBeFalsy();
  });

  test('should call LocalStorageAdapter.set with empty string if undefined is provided', () => {
    const setSpy = vi.spyOn(LocalStorageAdapter.prototype, 'set');
    setCurrentAccountAdapter(undefined as any);
    expect(setSpy).toHaveBeenCalledWith(process.env.VITE_LOCAL_STORAGE_ACCOUNT_IDENTIFIER as string, '');
  });
});
