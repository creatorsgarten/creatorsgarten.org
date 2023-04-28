export const githubClient = {
  id: import.meta.env.GITHUB_CLIENT_ID ?? process.env.GITHUB_CLIENT_ID,
  secret:
    import.meta.env.GITHUB_CLIENT_SECRET ??
    process.env.GITHUB_CLIENT_SECRET,
}
