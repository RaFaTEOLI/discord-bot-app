import { AccountModel } from '@/domain/models';
import { makeLocalStorageAdapter } from '@/main/factories/cache';
import { makeCryptoJSAdapter } from '@/main/factories/cryptography';

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  let encryptedAccount = '';
  if (account) {
    encryptedAccount = makeCryptoJSAdapter().encrypt(JSON.stringify(account));
  }
  makeLocalStorageAdapter().set(process.env.VITE_LOCAL_STORAGE_ACCOUNT_IDENTIFIER as string, encryptedAccount);
  makeLocalStorageAdapter().set(process.env.VITE_LOCAL_STORAGE_TOKEN_IDENTIFIER as string, account?.accessToken);
};

export const getCurrentAccountAdapter = (): AccountModel => {
  const encryptedAccount = makeLocalStorageAdapter().get(process.env.VITE_LOCAL_STORAGE_ACCOUNT_IDENTIFIER as string);
  if (encryptedAccount) {
    const decryptedAccount = makeCryptoJSAdapter().decrypt(encryptedAccount);
    return JSON.parse(decryptedAccount);
  }
  return undefined as unknown as AccountModel;
};
