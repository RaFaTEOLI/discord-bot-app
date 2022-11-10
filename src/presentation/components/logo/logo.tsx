const Logo = (props: any): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return <img {...props} src={`https://robohash.org/${process.env.VITE_BOT_NAME}`} />;
};

export default Logo;
