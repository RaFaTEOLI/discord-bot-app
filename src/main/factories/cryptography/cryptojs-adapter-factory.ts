import { CryptoJSAdapter } from '@/infra/cryptography/cryptojs-adapter';

export const makeCryptoJSAdapter = (): CryptoJSAdapter => {
  return new CryptoJSAdapter(process.env.VITE_ENCRYPTION_SECRET as string);
};
