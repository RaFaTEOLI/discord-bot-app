import { atom } from 'recoil';

export const signUpState = atom({
  key: 'signUpState',
  default: {
    isLoading: false,
    mainError: ''
  }
});
