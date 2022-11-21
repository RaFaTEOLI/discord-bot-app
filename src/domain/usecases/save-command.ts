import { CommandModel } from '@/domain/models';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface SaveCommand {
  save: (params: SaveCommand.Params) => Promise<void>;
}

export namespace SaveCommand {
  export type Params = Optional<CommandModel, 'id'>;

  export type Model = CommandModel;
}
