import { setCurrentAccountAdapter, getCurrentAccountAdapter } from '@/main/adapters';
import { mockAccountModel } from '@/domain/mocks';
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter';

jest.mock('@/infra/cache/local-storage-adapter');

describe('CurrentAccountAdapter', () => {
  test('should call LocalStorageAdapter.set with correct values', () => {
    const account = mockAccountModel();
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set');
    setCurrentAccountAdapter(account);
    expect(setSpy).toHaveBeenCalledWith('account', account);
  });

  test('should call LocalStorageAdapter.get with correct values', () => {
    const mockAccount = mockAccountModel();
    const getSpy = jest.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(mockAccount);
    const account = getCurrentAccountAdapter();
    expect(getSpy).toHaveBeenCalledWith('account');
    expect(account).toEqual(mockAccount);
  });
});
