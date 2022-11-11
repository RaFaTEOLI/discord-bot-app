import { signUpState } from './atoms';
import { SpotifyButton } from '@/presentation/components';
import { useRecoilValue } from 'recoil';

type Props = {
  text: string;
  onClick: () => Promise<void>;
};

const SignUpSpotifyButton = ({ text, onClick }: Props): JSX.Element => {
  const state = useRecoilValue(signUpState);
  return <SpotifyButton onClick={onClick} isLoading={state.isLoading} text={text} />;
};

export default SignUpSpotifyButton;
