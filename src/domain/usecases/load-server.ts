import { ServerModel } from '@/domain/models';

export interface LoadServer {
  load: () => Promise<LoadServer.Model>;
}

export namespace LoadServer {
  export type Model = ServerModel;
}
