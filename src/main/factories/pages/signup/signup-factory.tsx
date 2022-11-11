import React from 'react';
import { SignUp } from '@/presentation/pages';
import { makeRemoteAddAccount, makeRemoteSpotifyAuthorize } from '@/main/factories/usecases';

export const SignUpFactory: React.FC = () => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      spotifyAuthorize={makeRemoteSpotifyAuthorize(process.env.VITE_SPOTIFY_SIGNUP_REDIRECT_URI as string)}
    />
  );
};
