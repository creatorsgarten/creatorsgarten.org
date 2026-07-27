import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { createPrivateKey, createPublicKey } from 'crypto'
import { Elysia } from 'elysia'
import { exportJWK } from 'jose'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

import { collections } from '$constants/mongo'
import {
  reservedUsernames,
  usernameSchema,
} from '$functions/usernameValidation'
import { JWT_PRIVATE_KEY } from 'astro:env/server'
import { finalizeAuthentication } from './auth/finalizeAuthentication'

import { authenticateDiscord } from './auth/authenticateDiscord'
import { authenticateEventpopUser } from './auth/authenticateEventpopUser'
import { authenticateFigma } from './auth/authenticateFigma'
import { authenticateGitHub } from './auth/authenticateGitHub'
import { authenticateGoogle } from './auth/authenticateGoogle'
import { getAuthenticatedUser } from './auth/getAuthenticatedUser'

import { authenticateDeviceAuthorizationSignature } from './auth/authenticateDeviceAuthorizationSignature'
import { mintIdToken } from './auth/mintIdToken'
import {
  auditInputSchema,
  checkOAuthAudit,
  recordOAuthAudit,
} from './auth/oAuthAudit'
import { getDeviceAuthorization } from './deviceAuthorizations/getDeviceAuthorization'
import { saveDeviceAuthorization } from './deviceAuthorizations/saveDeviceAuthorization'
import { getJoinedEvents } from './events/getJoinedEvents'
import { checkAccess } from './gardenGate/checkAccess'
import { createAccessQrCode } from './gardenGate/createAccessQrCode'
import { pullLogs } from './gardenGate/pullLogs'
import { generateSignature } from './signatures/generateSignature'
import { verifySignature } from './signatures/verifySignature'
import { generateCloudinarySignature } from './uploads/generateCloudinarySignature'
import { getProfilePictureUrl } from './users/getProfilePictureUrl'
import { getPublicProfile, getPublicProfiles } from './users/getPublicProfile'
import {
  checkJoinability,
  createInviteLink,
  createWorkingGroup,
  getWorkingGroupWithDetails,
  joinWorkingGroup,
  workingGroupNameSchema,
} from './workingGroups/workingGroupService'

// Elysia sends a bare `null` return as an empty text/plain body, which Eden
// then reads back as `''`, not `null` -- wrap procedures that legitimately
// return `null` (e.g. "no such working group") with this so the response is
// real JSON `null` instead. The cast is safe: it only affects what Eden
// infers as the client-side type, not the (correct) runtime response.
function nullable<T>(value: T): T {
  return (value === null ? Response.json(null) : value) as T
}

// Same UNAUTHORIZED/FORBIDDEN/BAD_REQUEST/CONFLICT/etc -> HTTP status mapping
// tRPC's own fetch adapter used, reused here to translate `TRPCError`s that
// still originate deep in unmodified service functions (see issue #1995).
export const app = new Elysia()
  .derive(({ headers }) => ({
    authToken: headers.authorization?.replace(/^Bearer /, ''),
  }))
  .onError(({ error, status }) => {
    if (error instanceof TRPCError) {
      return status(getHTTPStatusCodeFromError(error), {
        error: error.message,
      })
    }
  })

  .get('/about', () => 'creatorsgarten.org')

  .get(
    '/users/getProfilePictureUrl',
    ({ query }) => getProfilePictureUrl(query.userId),
    { query: z.object({ userId: z.string() }) }
  )

  .get('/users/getPublicProfile', ({ query }) => getPublicProfile(query), {
    query: z
      .object({
        userId: z.string().optional(),
        username: z.string().optional(),
      })
      .refine(data => data.userId || data.username, {
        message: 'Either userId or username must be provided',
      }),
  })

  .get(
    '/users/getPublicProfiles',
    ({ query }) => getPublicProfiles(query.userIds),
    { query: z.object({ userIds: z.array(z.string()) }) }
  )

  .get('/auth/getAuthenticatedUser', async ({ authToken }) =>
    nullable(await getAuthenticatedUser(authToken))
  )

  .get(
    '/auth/checkOAuthAudit',
    ({ authToken, query }) => checkOAuthAudit(authToken, query),
    { query: auditInputSchema }
  )

  .post(
    '/auth/recordOAuthAudit',
    ({ authToken, body }) => recordOAuthAudit(authToken, body),
    { body: auditInputSchema }
  )

  .post(
    '/auth/mintIdToken',
    async ({ authToken, body, status }) => {
      const user = await getAuthenticatedUser(authToken)
      if (!user) {
        throw status(401, { error: 'User is not authenticated' })
      }
      return mintIdToken(user, body.audience, body.nonce, body.scopes)
    },
    {
      body: z.object({
        audience: z.string(),
        nonce: z.string().optional(),
        scopes: z.array(z.string()),
      }),
    }
  )

  .post(
    '/auth/signInWithEventpopAuthorizationCode',
    ({ body }) => authenticateEventpopUser(body.code),
    { body: z.object({ code: z.string() }) }
  )

  .post(
    '/auth/signInWithDeviceAuthorizationSignature',
    ({ body }) =>
      authenticateDeviceAuthorizationSignature(body.deviceId, body.signature),
    { body: z.object({ deviceId: z.string(), signature: z.string() }) }
  )

  .post(
    '/auth/linkGitHubAccount',
    ({ authToken, body }) => authenticateGitHub(body.code, authToken),
    { body: z.object({ code: z.string() }) }
  )

  .post(
    '/auth/linkDiscordAccount',
    ({ authToken, body }) => authenticateDiscord(body.code, authToken),
    { body: z.object({ code: z.string() }) }
  )

  .post(
    '/auth/linkGoogleAccount',
    ({ authToken, body }) => authenticateGoogle(body.code, authToken),
    { body: z.object({ code: z.string() }) }
  )

  .post(
    '/auth/linkFigmaAccount',
    ({ authToken, body }) => authenticateFigma(body.code, authToken),
    { body: z.object({ code: z.string() }) }
  )

  .get('/auth/getPublicKeys', async () => {
    const privateKeyObj = createPrivateKey(
      JWT_PRIVATE_KEY!.replaceAll(/\\n/g, '\n')
    )
    const publicKeyObj = createPublicKey(privateKeyObj)
    return [{ ...(await exportJWK(publicKeyObj)), kid: 'riffy1' }]
  })

  .get(
    '/auth/checkUsernameAvailability',
    async ({ query }) => {
      const { username } = query

      if (reservedUsernames.includes(username.toLowerCase())) {
        return { available: false, message: 'This username is reserved' }
      }

      const existingUser = await collections.users.findOne({
        username: username.toLowerCase(),
      })

      if (existingUser) {
        return { available: false, message: 'This username is already taken' }
      }

      return { available: true }
    },
    { query: z.object({ username: usernameSchema }) }
  )

  .post(
    '/auth/reserveUsername',
    async ({ authToken, body, status }) => {
      const user = await getAuthenticatedUser(authToken)
      if (!user) {
        throw status(401, {
          error: 'You must be logged in to reserve a username',
        })
      }

      if (!user.connections.github) {
        throw status(403, {
          error:
            'You must connect your GitHub account before reserving a username',
        })
      }

      const { username } = body
      const lowercaseUsername = username.toLowerCase()

      if (reservedUsernames.includes(lowercaseUsername)) {
        throw status(400, { error: 'This username is reserved' })
      }

      const existingUser = await collections.users.findOne({
        username: lowercaseUsername,
      })

      if (existingUser) {
        throw status(409, { error: 'This username is already taken' })
      }

      const result = await collections.users.updateOne(
        { _id: new ObjectId(user.sub) },
        { $set: { username: lowercaseUsername } }
      )

      if (result.modifiedCount === 0) {
        throw status(500, { error: 'Failed to update username' })
      }

      return finalizeAuthentication(user.uid)
    },
    { body: z.object({ username: usernameSchema }) }
  )

  .get('/events/getJoinedEvents', async ({ authToken }) => {
    const user = await getAuthenticatedUser(authToken)
    return getJoinedEvents(user)
  })

  .post(
    '/signatures/createSignature',
    async ({ authToken, body, status }) => {
      const user = await getAuthenticatedUser(authToken)
      if (!user) {
        throw status(401, { error: 'User is not authenticated' })
      }
      return generateSignature(user, body.message)
    },
    { body: z.object({ message: z.string() }) }
  )

  .get(
    '/signatures/verifySignature',
    ({ query }) => verifySignature(query.signature),
    { query: z.object({ signature: z.string() }) }
  )

  .get('/uploads/getCloudinaryParameters', async ({ authToken, status }) => {
    const user = await getAuthenticatedUser(authToken)
    if (!user) {
      throw status(401, { error: 'User is not authenticated' })
    }
    const params = {
      public_id_prefix: user.sub,
      asset_folder: user.sub,
      use_filename: 'true',
      use_filename_as_display_name: 'true',
      overwrite: 'false',
      metadata: `owner=${user.sub}`,
      colors: 'true',
      faces: 'true',
      quality_analysis: 'true',
      media_metadata: 'true',
      phash: 'true',
      detection: 'captioning',
      allowed_formats: 'webp,png,svg',
    }
    const cloudName = 'creatorsgarten'
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const apiKey = '537643412116516'
    const formData = generateCloudinarySignature(params, {
      cloudName,
      apiKey,
      apiSecret: process.env.CLOUDINARY_API_SECRET!,
    })
    return { url, formData }
  })

  .post(
    '/deviceAuthorizations/saveDeviceAuthorization',
    async ({ authToken, body }) => {
      const user = await getAuthenticatedUser(authToken)
      return saveDeviceAuthorization(user, body.deviceId, body.signature)
    },
    { body: z.object({ deviceId: z.string(), signature: z.string() }) }
  )

  .get(
    '/deviceAuthorizations/getDeviceAuthorization',
    ({ query }) => getDeviceAuthorization(query.deviceIdBasis),
    { query: z.object({ deviceIdBasis: z.string() }) }
  )

  .post('/gardenGate/createAccessQrCode', async ({ authToken }) => {
    const user = await getAuthenticatedUser(authToken)
    return createAccessQrCode(user)
  })

  .get('/gardenGate/checkAccess', async ({ authToken }) => {
    const user = await getAuthenticatedUser(authToken)
    return checkAccess(user)
  })

  .get('/gardenGate/pullLogs', async ({ authToken }) => {
    await getAuthenticatedUser(authToken)
    return pullLogs()
  })

  .get(
    '/workingGroups/getWorkingGroup',
    async ({ authToken, query }) => {
      const user = await getAuthenticatedUser(authToken)
      return nullable(await getWorkingGroupWithDetails(query.name, user))
    },
    { query: z.object({ name: workingGroupNameSchema }) }
  )

  .post(
    '/workingGroups/create',
    async ({ authToken, body, status }) => {
      const user = await getAuthenticatedUser(authToken)
      if (!user) {
        throw status(401, {
          error: 'You must be logged in to create a working group',
        })
      }

      await createWorkingGroup(body.name, user)

      return nullable(await getWorkingGroupWithDetails(body.name, user))
    },
    { body: z.object({ name: workingGroupNameSchema }) }
  )

  .post(
    '/workingGroups/createInviteLink',
    async ({ authToken, body, status }) => {
      const user = await getAuthenticatedUser(authToken)
      if (!user) {
        throw status(401, {
          error: 'You must be logged in to create an invite link',
        })
      }

      const result = await createInviteLink(body.name, user)

      return {
        key: result.key,
        enabled: result.enabled,
        createdAt: result.createdAt.toISOString(),
      }
    },
    { body: z.object({ name: workingGroupNameSchema }) }
  )

  .get(
    '/workingGroups/checkJoinability',
    async ({ authToken, query }) => {
      const user = await getAuthenticatedUser(authToken)
      // User can be null/undefined - service will handle authentication requirement
      return checkJoinability(query.inviteKey, user)
    },
    { query: z.object({ inviteKey: z.string() }) }
  )

  .post(
    '/workingGroups/joinWithInviteKey',
    async ({ authToken, body, status }) => {
      const user = await getAuthenticatedUser(authToken)
      if (!user) {
        throw status(401, {
          error: 'You must be logged in to join a working group',
        })
      }
      return joinWorkingGroup(body.inviteKey, user)
    },
    { body: z.object({ inviteKey: z.string() }) }
  )

export type App = typeof app
