export type MusicModel = {
  id: string;
  name: string;
  duration: string | null;
  startedAt: number;
  thumbnail?: string | null;
};

export type SpotifySearchModel = {
  artists: {
    items: [
      {
        images: [
          {
            height: string | null;
            url: string | null;
            width: string | null;
          }
        ];
      }
    ];
  };
  tracks: {
    items: [
      {
        album: {
          images: [
            {
              height: string | null;
              url: string | null;
              width: string | null;
            }
          ];
        };
      }
    ];
  };
};
