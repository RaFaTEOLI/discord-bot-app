export type SpotifyUserModel = {
  country: string;
  display_name: string;
  email: string;
  external_urls: [
    {
      spotify: string;
    }
  ];
  id: string;
  images: [
    {
      height: string | null;
      url: string;
      width: string | null;
    }
  ];
  product: string;
};
