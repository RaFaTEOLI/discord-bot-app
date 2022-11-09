import React from 'react';
import { SignUp } from '@/presentation/pages';
import { makeRemoteAddAccount } from '@/main/factories/usecases';

export const SignUpFactory: React.FC = () => {
  return <SignUp addAccount={makeRemoteAddAccount()} />;
};
