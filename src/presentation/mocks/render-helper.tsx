/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AccountModel } from '@/domain/models';
import { mockAccountModel, mockAccountWithSpotifyModel } from '@/domain/mocks';
import { currentAccountState } from '@/presentation/components';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import { MemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { MutableSnapshot, RecoilRoot, RecoilState } from 'recoil';

type Params = {
  Page: React.FC;
  history: MemoryHistory;
  account?: AccountModel;
  legacyRoot?: boolean;
  useAct?: boolean;
  states?: Array<{ atom: RecoilState<any>; value: any }>;
  adminUser?: boolean;
  spotifyUser?: boolean;
};

type Result = {
  setCurrentAccountMock: (account: AccountModel) => void;
  getCurrentAccountMock: () => AccountModel;
};

export const renderWithHistory = ({
  Page,
  useAct = false,
  history,
  account = mockAccountModel(),
  states = [],
  adminUser = false,
  spotifyUser = false
}: Params): Result => {
  const userAccount = spotifyUser ? mockAccountWithSpotifyModel() : account;
  const setCurrentAccountMock = jest.fn();
  const mockedState = {
    setCurrentAccount: setCurrentAccountMock,
    getCurrentAccount: () => (adminUser ? { ...userAccount, user: { ...userAccount.user, role: 'admin' } } : userAccount)
  };

  const initializeState = ({ set }: MutableSnapshot): void => {
    [...states, { atom: currentAccountState, value: mockedState }].forEach(state => set(state.atom, state.value));
  };

  if (useAct) {
    act(() => {
      render(
        <RecoilRoot initializeState={initializeState}>
          <Router navigator={history} location={history.location}>
            <Page />
          </Router>
        </RecoilRoot>
      );
    });
  } else {
    render(
      <RecoilRoot initializeState={initializeState}>
        <Router navigator={history} location={history.location}>
          <Page />
        </Router>
      </RecoilRoot>
    );
  }

  return {
    setCurrentAccountMock,
    getCurrentAccountMock: mockedState.getCurrentAccount
  };
};
