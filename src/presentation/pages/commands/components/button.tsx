import { commandsState } from '@/presentation/pages/commands/components';
import { useRecoilValue } from 'recoil';
import { Button } from '@chakra-ui/react';

type Props = {
  text: string;
  icon?: JSX.Element;
  onClick: () => void;
};

const CustomButton = ({ text, icon, onClick }: Props): JSX.Element => {
  const state = useRecoilValue(commandsState);
  return (
    <Button data-testid="custom-button" w="full" onClick={onClick} isLoading={state.isLoading} leftIcon={icon}>
      {text}
    </Button>
  );
};

export default CustomButton;
