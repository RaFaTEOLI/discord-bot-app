import { loginState } from './atoms';
import { InputBase } from '@/presentation/components';
import { useRecoilState } from 'recoil';

type Props = {
  type: string;
  name: string;
  placeholder: string;
  icon?: JSX.Element | undefined;
};

const Input = ({ type, name, placeholder, icon, ...props }: Props): JSX.Element => {
  const [state] = useRecoilState(loginState);
  return <InputBase type={type} name={name} placeholder={placeholder} state={state} icon={icon} {...props} />;
};

export default Input;
