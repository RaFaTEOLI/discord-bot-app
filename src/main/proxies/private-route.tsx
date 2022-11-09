import { Navigate } from 'react-router-dom';
import { currentAccountState } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

interface Props {
  children?: JSX.Element;
}

const PrivateRoute = ({ children }: Props): JSX.Element => {
  const { getCurrentAccount } = useRecoilValue(currentAccountState);
  return getCurrentAccount()?.accessToken ? <>{children}</> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
