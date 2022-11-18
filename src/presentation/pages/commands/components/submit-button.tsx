import { commandsState } from './atoms';
import { SubmitButtonBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

type Props = {
  text: string;
  icon?: JSX.Element;
};

const SubmitButton = ({ text, icon }: Props): JSX.Element => {
  const state = useRecoilValue(commandsState);
  return <SubmitButtonBase isLoading={state.isLoading} text={text} state={state} icon={icon} />;
};

export default SubmitButton;