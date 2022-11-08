export class EmailAlreadyBeingUsedError extends Error {
  constructor() {
    super('Email Already Being Used');
    this.name = 'EmailAlreadyBeingUsedError';
  }
}
