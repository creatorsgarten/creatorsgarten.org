export const oauthClients: OAuthClientConfig[] = [
  {
    clientId: 'https://github.com/dtinth/authgarten-example',
    name: 'Authgarten Example',
    redirectUris: [
      'http://localhost:35329/api/auth/callback/creatorsgarten',
      'https://authgarten-example.vercel.app/api/auth/callback/creatorsgarten',
    ],
  },
]

interface OAuthClientConfig {
  /** Client ID */
  clientId: string

  /** Application name */
  name: string

  /** Allowed redirect URIs */
  redirectUris: string[]
}
