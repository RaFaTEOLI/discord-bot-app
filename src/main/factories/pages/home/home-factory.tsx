import { Home } from '@/presentation/pages';
import { makeRemoteLoadServer } from '@/main/factories/usecases';

export const HomeFactory = (): JSX.Element => {
  return <Home loadServer={makeRemoteLoadServer()} />;
};
