import { InputBase } from '@/presentation/components';
import { useRecoilState } from 'recoil';
import { commandState } from './atoms';

type Props = {
  type: string;
  name: string;
  placeholder: string;
  icon?: JSX.Element | undefined;
  bgColor?: string;
  isDisabled?: boolean;
};

const Input = ({ type, name, placeholder, icon, isDisabled, ...props }: Props): JSX.Element => {
  const [state] = useRecoilState(commandState);
  return (
    <InputBase
      isDisabled={isDisabled}
      type={type}
      name={name}
      placeholder={placeholder}
      state={state}
      icon={icon}
      {...props}
    />
  );
};

export default Input;
