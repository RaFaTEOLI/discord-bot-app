import { CommandModel } from '@/domain/models';
export interface LoadCommandById {
  loadById: (id: string) => Promise<LoadCommandById.Model>;
}

export namespace LoadCommandById {
  export type Model = CommandModel;
}
