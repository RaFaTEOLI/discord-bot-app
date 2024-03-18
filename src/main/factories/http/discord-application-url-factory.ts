export const makeDiscordApplicationApiUrl = (path: string): string => {
  const applicationId = process.env.VITE_DISCORD_APPLICATION_ID as string;
  const apiUrl = `https://discord.com/api/v10/applications/${applicationId}`;

  if (path.startsWith('/')) {
    return `${apiUrl}${path}`;
  }
  return `${apiUrl}/${path}`;
};
