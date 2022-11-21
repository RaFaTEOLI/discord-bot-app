import { commandsState } from '@/presentation/pages/commands/components';
import { SelectBase } from '@/presentation/components';
import { useRecoilState } from 'recoil';
import { Options } from '@/presentation/components/select/select';

type Props = {
  name: string;
  placeholder: string;
  options: Options[];
  isDisabled?: boolean | undefined;
};

const Select = ({ name, placeholder, options, ...props }: Props): JSX.Element => {
  const [state, setState] = useRecoilState(commandsState);
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
