import { Encrypter, Decrypter } from '@/data/protocols/cryptography';
import CryptoJS from 'crypto-js';

export class CryptoJSAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  encrypt(value: string): string {
    const ciphertext = CryptoJS.AES.encrypt(value, this.secret).toString();
    return ciphertext;
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
