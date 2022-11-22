import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { UnexpectedError } from '@/domain/errors';
import { RunCommand } from '@/domain/usecases';

export class RemoteRunCommand implements RunCommand {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<void>,
    private readonly botName: string
  ) {}

  async run(command: string): Promise<void> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'post',
      body: {
        username: `${this.botName} Web`,
        avatar_url: `https://robohash.org/${this.botName}?gravatar=hashed`,
        content: `!${command}`
      },
      headers: { 'Content-Type': 'application/json' }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent:
        return;
      default:
        throw new UnexpectedError();
    }
  }
}
