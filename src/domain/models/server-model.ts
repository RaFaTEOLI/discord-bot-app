export type ServerModel = {
  id: string;
  name: string;
  instant_invite: null;
  channels: [
    {
      id: string;
      name: string;
      position: number;
    }
  ];
  members: [
    {
      id: string;
      username: string;
      discriminator: string;
      avatar: null;
      status: 'online' | 'dnd' | 'idle';
      avatar_url: string;
      game?: {
        name: string;
      };
    }
  ];
  presence_count: number;
};
