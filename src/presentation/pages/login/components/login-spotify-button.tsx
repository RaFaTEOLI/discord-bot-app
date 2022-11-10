import { loginState } from './atoms';
import { SpotifyButton } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

type Props = {
  text: string;
  onClick: () => Promise<void>;
};

const LoginSpotifyButton = ({ text, onClick }: Props): JSX.Element => {
  const state = useRecoilValue(loginState);
  return <SpotifyButton onClick={onClick} isLoading={state.isLoading} text={text} />;
};

export default LoginSpotifyButton;
