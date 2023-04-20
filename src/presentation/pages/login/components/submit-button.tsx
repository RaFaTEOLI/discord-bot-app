import { loginState } from './atoms';
import { SubmitButtonBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

type Props = {
  text: string;
  icon?: JSX.Element;
};

const SubmitButton = ({ text, icon }: Props): JSX.Element => {
  const state = useRecoilValue(loginState);
  return <SubmitButtonBase isLoading={state.isLoading} text={text} icon={icon} />;
};

export default SubmitButton;
