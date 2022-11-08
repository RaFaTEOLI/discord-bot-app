import { loginState } from './atoms';
import { SubmitButtonBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

type Props = {
  text: string;
  icon?: JSX.Element;
};

const SubmitButton = ({ text, icon }: Props) => {
  const state = useRecoilValue(loginState);
  return <SubmitButtonBase text={text} state={state} icon={icon} />;
};

export default SubmitButton;
