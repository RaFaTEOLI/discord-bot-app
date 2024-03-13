import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginFactory,
  SignUpFactory,
  HomeFactory,
  CommandsFactory,
  CommandFactory,
  ProfileFactory,
  PlaylistsFactory,
  PlaylistFactory,
  BrowseFactory
} from '@/main/factories/pages/';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';
import { currentAccountState } from '@/presentation/components';
import { RecoilRoot } from 'recoil';
import { PrivateRoute } from '../proxies';
import { LayoutFactory, SpotifyContainerFactory, DiscordContainerFactory } from '@/main/factories/components';

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
              <Route path="/commands/:id" element={<CommandFactory />} />

              <Route path="/playlists" element={<PlaylistsFactory />} />
              <Route path="/playlists/:id" element={<PlaylistFactory />} />

              <Route path="/profile" element={<ProfileFactory />} />
              <Route path="/browse" element={<BrowseFactory />} />

              <Route path="/discord/commands" element={<p>Test</p>} />
            </Route>
          </Route>
          <Route path="/discord" element={<DiscordContainerFactory />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default Router;
