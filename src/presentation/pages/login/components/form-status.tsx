import { loginState } from './atoms';
import { FormStatusBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

const FormStatus = (): JSX.Element => {
  const state = useRecoilValue(loginState);
  return <FormStatusBase state={state} />;
};

export default FormStatus;
