import { CommandModel } from '@/domain/models';
export interface LoadCommands {
  all: () => Promise<LoadCommands.Model[]>;
}

export namespace LoadCommands {
  export type Model = CommandModel;
}
