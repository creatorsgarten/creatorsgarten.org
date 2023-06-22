export const discordClient = {
  id: import.meta.env.DISCORD_CLIENT_ID ?? process.env.DISCORD_CLIENT_ID,
  secret:
    import.meta.env.DISCORD_CLIENT_SECRET ?? process.env.DISCORD_CLIENT_SECRET,
}
