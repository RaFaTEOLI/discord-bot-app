import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginFactory,
  SignUpFactory,
  HomeFactory,
  CommandsFactory,
  ProfileFactory,
  PlaylistsFactory
} from '@/main/factories/pages/';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';
import { currentAccountState } from '@/presentation/components';
import { RecoilRoot } from 'recoil';
import { PrivateRoute } from '../proxies';
import { LayoutFactory, SpotifyContainerFactory } from '@/main/factories/components';
import { Playlist } from '@/presentation/pages';

const Router = (): JSX.Element => {
  const state = {
    setCurrentAccount: setCurrentAccountAdapter,
    getCurrentAccount: getCurrentAccountAdapter
  };
  return (
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, state)}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpotifyContainerFactory />}>
            <Route path="/signup" element={<SignUpFactory />} />
            <Route path="/login" element={<LoginFactory />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <LayoutFactory />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<HomeFactory />} />
              <Route path="/commands" element={<CommandsFactory />} />
              <Route path="/playlists" element={<PlaylistsFactory />} />
              <Route path="/playlists/:id" element={<Playlist />} />
              <Route path="/profile" element={<ProfileFactory />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default Router;
