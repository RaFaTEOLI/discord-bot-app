import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginFactory, SignUpFactory, HomeFactory, CommandsFactory } from '@/main/factories/pages/';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';
import { currentAccountState } from '@/presentation/components';
import { RecoilRoot } from 'recoil';
import { PrivateRoute } from '../proxies';
import Layout from '@/presentation/components/layout/layout';

const Router = (): JSX.Element => {
  const state = {
    setCurrentAccount: setCurrentAccountAdapter,
    getCurrentAccount: getCurrentAccountAdapter
  };
  return (
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, state)}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUpFactory />} />
          <Route path="/login" element={<LoginFactory />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<HomeFactory />} />
            <Route path="/commands" element={<CommandsFactory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default Router;
