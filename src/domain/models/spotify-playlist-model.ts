export type SpotifyTrackModel = {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: 'user';
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: {
    album: {
      album_type: string;
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }
      ];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: [
        {
          height: number | null;
          url: string;
          width: number | null;
        },
        {
          height: number | null;
          url: string;
          width: number | null;
        },
        {
          height: number | null;
          url: string;
          width: number | null;
        }
      ];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number | string;
      type: string;
      uri: string;
    };
    artists: [
      {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }
    ];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: boolean;
    track_number: number;
    type: string;
    uri: string;
  };
  video_thumbnail: {
    url: string | null;
  };
};

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
    items?: SpotifyTrackModel[];
    total: number;
    next?: string | null;
    offset?: number;
    previous?: string | null;
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

export type SpotifyPlaylistTrackListModel = {
  href: string;
  items: SpotifyTrackModel[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
