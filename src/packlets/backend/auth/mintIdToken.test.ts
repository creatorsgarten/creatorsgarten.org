import { describe, expect, it, vi } from 'vitest'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { mintIdToken } from './mintIdToken'

vi.mock('astro:env/server', () => ({
  JWT_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDs2q4zlYCNT49F
PTr273cR4Z88l+Ias762dJpHOTqqXWCwUw5m9Qt0zaQ6DeXNZflIj/FqWzEN9f0H
liWNz4S89o//u15uT2fbLH+7ipzFGXCFbHy086Foo2eenKWglsOyHuouFpSTANRA
121UmwLr8TmncrBrI3+bPGkZ9q4Y3RSfX8hAoFfGE4osIWvUf+reTBYPdbTZV5FB
exdJEvfvuvfQemQrbeewquq9irGMmryG4OlzdNYWW3bLp22y1Er3hew9OJoqam4q
KZVPP5HAxWqqJhiS1bbf+9ZcqxG/tlNCn/m71H5bO9/Rw8jQniZ3ivKR8oNeoito
a4vmtcilAgMBAAECggEAOfBOf7jZDvhAzEerpl8yqdGe0cQ3n5+LjfddDAIwWx9n
eQqAMehMiqCJRVhD+CgzQDBR9lnjWI5tfI8alaOHTXAlDoInmeVbuu4aOuav7bkI
4OKGaP9V4xJh1Rdtnqhyq55LW8XTR1iDE29/Q5x9rPi/yTnRdQvkebVf4mWI9fSa
RDnLU7YARlhOLbkJj48ljRKMGrzbt2HlgAWhykrou8tELPbNZdsTeb2vIbO7ilEb
D8uaIMBPVcdtRJU/u4168kRA0f6yh9biro6XqyI0EbBk77RpvJ8EZBsrHiGke8Fa
v3YGmL3hledekgstmybkzSrNUGX2+pbGVD12af/LcQKBgQD9BdL7QMPNFO5jJm6F
EE8oKOD7Kcn4dKrIhElG6lYRtEZXT4i0s1hx/hz4FiBSnz1yVHTfbQzPJeOeTYss
yEB4urwOAN6ZTkVCvDiMmRkKv/NQ4Bk/UMfmElTPf14e9NL/yoRxvRYfADtqQd0e
lUUXpOTJcbaUPIf0c2chBMoc2QKBgQDvpCbz07H4RUzXh8Ji658cDJz2zbwMbIF2
myXCu+9qXGH78aiVY8/pUBLlavf77/Lw7y0BJhrdmnD6e0aSvg29wPspY0hbkZr0
E0qna2E3cQpU/8VVmsuR4p5DtTcgIwuG3/qKDP71yGMdCKa9jGuXFOSbI2Q1cy3A
5rqNblxarQKBgC0oyfRAJfJHhxi5NkaXl5kyWp1ZYwvuPsEVI0L99iioxVk1/89I
p0OJOEBrKo+0jjIGsulhvESInayWaH2wrBkgMwpIy3IPTztO/sTRWm/ZvKK1rKvp
ThRZNzvlnrXlunce/S6TsgwMbY5UfRPFTpSewJrXqd+hQh62LjTtdulZAoGAHvtx
EcsH0lpbUe46YoGmA4FZ9cqpik2o+0WZvzB/BphFDsayjgXmhnqUxtZqk0b1eNLj
Vaewh4AFJU001Zn+us6tai9s1nHfv7iSyUxnuDxEIrMityuZMBZFcemG4//D6L8i
bCC8AdjTf5hzvkPeUR0hZTFRLlviyXLLIafoBs0CgYAnObyGhFbvNuU1Vb44Hy//
NBkGUpjYtt3p0/rHOFkN3sG66Tiu4s2xKhUgGgGBjhullsBEW7E0+kRWrrpc5b9Z
0ENwbUiQDo8noqeKMjFtQWlPzp24kUPg9OsUvQwDSPcJFCQlrUJpxFm4MYLJGO0q
m/5OKS96wcIAgSpPb+eAgQ==
-----END PRIVATE KEY-----
`,
}))

vi.mock('../events/getJoinedEvents', () => ({
  getJoinedEvents: vi.fn(async () => []),
}))

const baseUser: AuthenticatedUser = {
  sub: '507f1f77bcf86cd799439011',
  uid: 123,
  name: 'Test User',
  avatar: 'https://example.com/avatar.png',
  email: 'test@example.com',
  connections: {
    github: null,
    discord: null,
    google: null,
    figma: null,
  },
}

describe('mintIdToken', () => {
  it('includes username claim when the username scope is requested', async () => {
    const userWithUsername: AuthenticatedUser = {
      ...baseUser,
      username: 'alice',
    }

    const { claims } = await mintIdToken(
      userWithUsername,
      'https://example.com',
      undefined,
      ['openid', 'username']
    )

    expect(claims.username).toBe('alice')
  })

  it('omits username when the scope is not requested', async () => {
    const userWithUsername: AuthenticatedUser = {
      ...baseUser,
      username: 'alice',
    }

    const { claims } = await mintIdToken(
      userWithUsername,
      'https://example.com',
      undefined,
      ['openid']
    )

    expect(claims.username).toBeUndefined()
  })

  it('throws when username scope is requested but username is missing', async () => {
    await expect(
      mintIdToken(baseUser, 'https://example.com', undefined, [
        'openid',
        'username',
      ])
    ).rejects.toThrow(
      'You need to create a public profile first. Go to the dashboard and open the profile section to reserve a username.'
    )
  })
})
