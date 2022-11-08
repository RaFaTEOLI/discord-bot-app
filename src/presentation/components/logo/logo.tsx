const Logo = () => {
  return <img src={`https://robohash.org/${process.env.VITE_BOT_NAME}`} />;
};

export default Logo;
