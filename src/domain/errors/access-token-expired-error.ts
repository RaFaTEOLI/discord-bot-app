export class AccessTokenExpiredError extends Error {
  constructor() {
    super('Access Token Expired!');
    this.name = 'AccessTokenExpiredError';
  }
}
