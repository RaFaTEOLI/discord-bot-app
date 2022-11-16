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
      height: string;
      url: string;
      width: string;
    }
  ];
  product: string;
};
