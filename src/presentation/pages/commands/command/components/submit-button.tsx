import { SubmitButtonBase } from '@/presentation/components';
import { useRecoilValue } from 'recoil';
import { commandState } from './atoms';

type Props = {
  text: string;
  icon?: JSX.Element;
};

const SubmitButton = ({ text, icon }: Props): JSX.Element => {
  const state = useRecoilValue(commandState);
  return <SubmitButtonBase isLoading={state.isLoading} text={text} icon={icon} />;
};

export default SubmitButton;
