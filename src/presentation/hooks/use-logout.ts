import { AccountModel } from '@/domain/models';
import { currentAccountState } from '@/presentation/components';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

type ResultType = () => void;

export const useLogout = (): ResultType => {
  const navigate = useNavigate();
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  return (): void => {
    setCurrentAccount(undefined as unknown as AccountModel);
    navigate('/login');
  };
};
