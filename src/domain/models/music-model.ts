export type MusicModel = {
  id: string;
  name: string;
  duration: string | null;
  startedAt: number;
  thumbnail?: string | null;
};

export type SpotifySearchModel = {
  artists: {
    href: string;
    items: [
      {
        external_urls: {
          spotify: string;
        };
        followers: {
          href: null;
          total: number;
        };
        genres: any[];
        href: string;
        id: string;
        images: [
          {
            height: number;
            url: string;
            width: number;
          }
        ];
        name: string;
        popularity: number;
        type: string;
        uri: string;
      }
    ];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  tracks: {
    href: string;
    items: [
      {
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
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          images: [
            {
              height: number;
              url: string;
              width: number;
            }
          ];
          name: string;
          release_date: string;
          release_date_precision: string;
          total_tracks: number;
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
        disc_number: number;
        duration_ms: number;
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
        is_playable: boolean;
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
      }
    ];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
};
