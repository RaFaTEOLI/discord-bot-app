export interface DeleteCommand {
  delete: (commandId: string) => Promise<void>;
}
