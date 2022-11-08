import { loginState } from './atoms';
import { FormStatusBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

const FormStatus = () => {
  const state = useRecoilValue(loginState);
  return <FormStatusBase state={state} />;
};

export default FormStatus;
