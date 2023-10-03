import { SelectBase } from '@/presentation/components';
import { useRecoilState } from 'recoil';
import { Options } from '@/presentation/components/select/select';
import { commandState } from './atoms';

type Props = {
  name: string;
  placeholder: string;
  options: Options[];
  isDisabled?: boolean | undefined;
  bgColor?: string;
};

const Select = ({ name, placeholder, options, ...props }: Props): JSX.Element => {
  const [state, setState] = useRecoilState(commandState);
  return (
    <SelectBase
      isDisabled={state.disabledForm}
      options={options}
      name={name}
      placeholder={placeholder}
      state={state}
      setState={setState}
      {...props}
    />
  );
};

export default Select;
