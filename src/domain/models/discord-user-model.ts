export type DiscordUserModel = {
  user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string;
    discriminator: string;
    public_flags: number;
    avatar_decoration: string | null;
  };
};
