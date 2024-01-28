import type { frontMatterSchema } from '$functions/parseFrontMatter'
import type { z } from 'zod'
import { getMarkdownFromSlug } from './getMarkdownFromSlug'
import type { AstroGlobal } from 'astro'

export async function getWikiPage(pageRef: string) {
  const markdown = await getMarkdownFromSlug<
    z.infer<typeof frontMatterSchema>['event'] & { title: string }
  >(pageRef)

  return markdown
}

export type WikiPage = Awaited<ReturnType<typeof getWikiPage>>

export function modifyResponseForWikiPage(
  page: WikiPage,
  Astro: Pick<AstroGlobal, 'url' | 'response'>
) {
  const { status, targetPageRef } = page
  if (
    status === 301 &&
    targetPageRef &&
    Astro.url.searchParams.get('redirect') !== 'no'
  ) {
    Astro.response.status = 301
    Astro.response.headers.set('Location', `/wiki/${targetPageRef}`)
  } else if (status === 404) {
    Astro.response.status = 404
  } else if (status === 500) {
    Astro.response.status = 500
  }
}
