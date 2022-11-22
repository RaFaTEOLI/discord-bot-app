export interface RunCommand {
  run: (command: string) => Promise<void>;
}
