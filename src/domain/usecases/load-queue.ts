import { QueueModel } from '@/domain/models';
export interface LoadQueue {
  all: () => Promise<LoadQueue.Model[]>;
}

export namespace LoadQueue {
  export type Model = QueueModel;
}
