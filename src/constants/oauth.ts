export const oauthClients: OAuthClientConfig[] = [
  {
    clientId: 'https://github.com/dtinth/authgarten-example',
    name: 'Authgarten Example',
    redirectUris: [
      'https://authgarten-example.vercel.app/api/auth/callback/creatorsgarten',
    ],
  },
  {
    clientId: 'https://github.com/StupidHackTH/event-currency-interface',
    name: 'wallet.7th.stupid.hackathon.in.th',
    redirectUris: [
      'https://wallet.7th.stupid.hackathon.in.th/api/auth/callback/creatorsgarten',
    ],
  },
]

export interface OAuthClientConfig {
  /** Client ID */
  clientId: string

  /** Application name */
  name: string

  /** Allowed redirect URIs */
  redirectUris: string[]
}
