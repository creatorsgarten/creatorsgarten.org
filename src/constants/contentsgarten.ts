import { CONTENT_API_URL } from 'astro:env/server'
import createClient from 'openapi-fetch'
import type { paths } from '$types/ContentsgartenRestApi'

function client(authorizationToken?: string) {
  return createClient<paths>({
    baseUrl: `${CONTENT_API_URL}/api/wiki`,
    headers: authorizationToken
      ? { Authorization: `Bearer ${authorizationToken}` }
      : undefined,
  })
}

async function unwrap<Data, Err>(
  promise: Promise<{ data?: Data; error?: Err; response: Response }>
): Promise<Data> {
  const { data, error, response } = await promise
  if (error !== undefined) {
    throw new Error(
      `Contentsgarten REST API error (${response.status}): ${JSON.stringify(error)}`
    )
  }
  return data as Data
}

function boolParam(value: boolean | undefined) {
  return value === undefined ? undefined : String(value)
}

export interface SearchInput {
  match?: Record<string, string | string[] | true>
  prefix?: string
  pageRef?: string | string[]
}

export interface ViewInput {
  pageRef: string
  withFile?: boolean
  revalidate?: boolean
  render?: boolean
}

/**
 * REST-backed client, shaped like the old tRPC proxy client
 * (`.search.query(...)`, `.view.query(...)`, etc.) so call sites written
 * against the tRPC client didn't need to change.
 */
export const contentsgarten = (authorizationToken?: string) => {
  const c = client(authorizationToken)
  return {
    search: {
      query: (input: SearchInput) =>
        unwrap(
          c.GET('/pages', {
            params: { query: { q: JSON.stringify(input) } },
          })
        ),
    },
    view: {
      query: (input: ViewInput) =>
        unwrap(
          c.GET('/page', {
            params: {
              query: {
                pageRef: input.pageRef,
                withFile: boolParam(input.withFile),
                revalidate: boolParam(input.revalidate),
                render: boolParam(input.render),
              },
            },
          })
        ),
    },
    getContributors: {
      query: (input: { pageRef: string }) =>
        unwrap(
          c.GET('/page-contributors', {
            params: { query: { pageRef: input.pageRef } },
          })
        ),
    },
    getEditPermission: {
      query: (input: { pageRef: string }) =>
        unwrap(
          c.GET('/page-permission', {
            params: { query: { pageRef: input.pageRef } },
          })
        ),
    },
    save: {
      mutate: (input: {
        pageRef: string
        newContent: string
        oldRevision?: string
      }) =>
        unwrap(
          c.PUT('/page', {
            params: { query: { pageRef: input.pageRef } },
            body: {
              newContent: input.newContent,
              oldRevision: input.oldRevision,
            },
          })
        ),
    },
  }
}
