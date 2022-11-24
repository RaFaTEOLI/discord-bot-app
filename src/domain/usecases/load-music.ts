import { MusicModel } from '@/domain/models';
export interface LoadMusic {
  load: () => Promise<LoadMusic.Model>;
}

export namespace LoadMusic {
  export type Model = MusicModel | null;
}
