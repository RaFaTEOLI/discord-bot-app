import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginFactory } from '@/main/factories/pages/';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';
import { currentAccountState } from '@/presentation/components';
import { RecoilRoot } from 'recoil';

const Router = () => {
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
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default Router;
