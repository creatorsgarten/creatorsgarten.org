export const gristSecrets = {
  baseUrl: import.meta.env.GRIST_API_URL ?? process.env.GRIST_API_URL,
  apiKey:
    import.meta.env.GRIST_API_KEY ?? process.env.GRIST_API_KEY,
}

