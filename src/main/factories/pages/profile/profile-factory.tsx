import { Profile } from '@/presentation/pages';
import { makeRemoteLoadUser } from '@/main/factories/usecases';

export const ProfileFactory = (): JSX.Element => {
  return <Profile loadUser={makeRemoteLoadUser()} />;
};
