import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginFactory } from '@/main/factories/pages/';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';
import { currentAccountState } from '@/presentation/components';
import { RecoilRoot } from 'recoil';
import { PrivateRoute } from '../proxies';

const Router = (): JSX.Element => {
  const state = {
    setCurrentAccount: setCurrentAccountAdapter,
    getCurrentAccount: getCurrentAccountAdapter
  };
  return (
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, state)}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<>Signup</>} />
          <Route path="/login" element={<LoginFactory />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <>Index Page</>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default Router;
