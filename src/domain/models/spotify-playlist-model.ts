export type SpotifyPlaylistModel = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [
    {
      height: string | null;
      url: string;
      width: string | null;
    }
  ];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: 'playlist';
  uri: string;
};

export type SpotifyPlaylistListModel = {
  href: string;
  items: SpotifyPlaylistModel[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
