import { commandsState } from '@/presentation/pages/commands/components';
import { SubmitButtonBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

type Props = {
  text: string;
  icon?: JSX.Element;
};

const SubmitButton = ({ text, icon }: Props): JSX.Element => {
  const state = useRecoilValue(commandsState);
  return <SubmitButtonBase isDisabled={state.disabledForm} isLoading={state.isLoading} text={text} icon={icon} />;
};

export default SubmitButton;
