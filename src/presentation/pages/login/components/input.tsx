import { loginState } from './atoms';
import { InputBase } from '@/presentation/components';
import { useRecoilState } from 'recoil';

type Props = {
  type: string;
  name: string;
  placeholder: string;
  icon?: JSX.Element | undefined;
};

const Input = ({ type, name, placeholder, icon, ...props }: Props) => {
  const [state, setState] = useRecoilState(loginState);
  return (
    <InputBase type={type} name={name} placeholder={placeholder} state={state} setState={setState} icon={icon} {...props} />
  );
};

export default Input;
