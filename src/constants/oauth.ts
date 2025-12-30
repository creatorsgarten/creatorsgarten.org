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
  {
    clientId: 'https://github.com/StupidHackTH/sht7-vote',
    name: 'vote.7th.stupid.hackathon.in.th',
    redirectUris: [
      'https://vote.7th.stupid.hackathon.in.th/api/auth/callback/creatorsgarten',
    ],
    allowedScopes: ['email', 'https://eventpop.me/e/15113'],
  },
  {
    clientId: 'https://db.creatorsgarten.org',
    name: 'NocoDB',
    redirectUris: ['https://db.creatorsgarten.org/sso/callback.html'],
    allowedScopes: ['email'],
  },
]

export interface OAuthClientConfig {
  /** Client ID */
  clientId: string

  /** Application name */
  name: string

  /** Allowed redirect URIs */
  redirectUris: string[]

  /** Allowed scopes */
  allowedScopes?: OAuthScope[]
}

export type OAuthScope =
  | 'openid'
  | 'email'
  | 'username'
  | `https://eventpop.me/e/${string}`

export function isSensitiveScope(scope: string) {
  if (scope === 'email') {
    return true
  }
  if (scope.startsWith('https://eventpop.me/e/')) {
    return true
  }
  return false
}
