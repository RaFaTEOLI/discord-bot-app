import { DiscordAuthorize } from '@/domain/usecases';

export class RemoteDiscordAuthorize implements DiscordAuthorize {
  constructor(private readonly url: string, private readonly discordSettings: DiscordAuthorize.Params) {}

  async authorize(): Promise<string> {
    const queryString = `?client_id=${this.discordSettings.clientId}&redirect_uri=${this.discordSettings.redirectUri}&response_type=${this.discordSettings.responseType}&scope=${this.discordSettings.scope}`;
    return await Promise.resolve(`${this.url}${queryString}`);
  }
}
