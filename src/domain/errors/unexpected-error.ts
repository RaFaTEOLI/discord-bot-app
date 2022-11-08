export class UnexpectedError extends Error {
  constructor() {
    super('Something went wrong! Try again later');
    this.name = 'UnexpectedError';
  }
}
