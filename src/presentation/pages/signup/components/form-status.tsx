import { signUpState } from './atoms';
import { FormStatusBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

const FormStatus = (): JSX.Element => {
  const state = useRecoilValue(signUpState);
  return <FormStatusBase state={state} />;
};

export default FormStatus;
