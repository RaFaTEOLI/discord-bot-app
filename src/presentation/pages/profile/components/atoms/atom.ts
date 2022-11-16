import { LoadUser } from '@/domain/usecases';
import { atom } from 'recoil';

export const userProfileState = atom({
  key: 'userProfileState',
  default: {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    userProfile: {
      id: '',
      email: '',
      display_name: '',
      country: '',
      external_urls: [{ spotify: '' }],
      images: [
        {
          height: null,
          url: '',
          width: null
        }
      ],
      product: 'premium'
    } as LoadUser.Model
  }
});
