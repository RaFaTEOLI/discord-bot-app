export class CommandAlreadyCreatedError extends Error {
  constructor(commandName: string) {
    super(`There is already a command created with this name: ${commandName}`);
    this.name = 'CommandAlreadyCreatedError';
  }
}
