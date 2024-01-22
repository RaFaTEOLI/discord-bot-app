import { useRecoilValue } from 'recoil';
import { userPlaylistsState } from './atom';
import { Button, ButtonProps } from '@chakra-ui/react';

type Props = ButtonProps & {
  text: string;
  icon?: JSX.Element;
  onClick: () => void;
};

const CustomButton = ({ text, icon, onClick, ...rest }: Props): JSX.Element => {
  const state = useRecoilValue(userPlaylistsState);
  return (
    <Button w={150} onClick={onClick} isLoading={state.isLoading} leftIcon={icon} {...rest}>
      {text}
    </Button>
  );
};

export default CustomButton;
