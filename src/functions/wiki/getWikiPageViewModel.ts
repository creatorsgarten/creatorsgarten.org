import {
  parseFrontMatter,
  type FrontMatter,
  type frontMatterSchema,
} from '$functions/parseFrontMatter'
import type { ContentsgartenOutput } from '$types/ContentsgartenOutput'
import type { AstroGlobal } from 'astro'
import type { z } from 'zod'
import { fromZodError, type ValidationError } from 'zod-validation-error'
import { formatPageRef } from './formatPageRef'
import { getContentHash, getMarkdownFromSlug } from './getMarkdownFromSlug'
import { getWikiDescription } from './getWikiDescription'

export interface WikiPageViewModel {
  respond: (response: AstroGlobal['response']) => void
  head: {
    title: string
    description: string | undefined
    ogImage: string
  }
  body: EditorMode | ViewMode | SimpleMode
  perf: string[]
}

/** Common info between editor mode and view mode */
export interface PageInfo {
  pageRef: string
  contentHash: string
  title: string
  headings: NonNullable<ContentsgartenOutput['view']['rendered']>['headings']
  parsedFrontMatter?: FrontMatter
  lastModified?: string
  lastModifiedBy?: string[]
  editable: boolean
}

export interface EditorMode extends PageInfo {
  mode: 'editor'
  file: EditingFile
}

export interface ViewMode extends PageInfo {
  mode: 'view'
  validationError?: ValidationError
  html: string
  filePath: string | undefined
}

export interface SimpleMode {
  mode: 'simple'
  pageRef: string
  html: string
  contentHash: string
  filePath: string | undefined
  editable: boolean
}

export interface EditingFile {
  path: string
  content: string
  revision?: string | undefined
}

export async function getWikiPageViewModel(input: {
  pageRef: string
  mode: 'view' | 'editor'
  searchParams: URLSearchParams
}): Promise<WikiPageViewModel> {
  const { pageRef, mode, searchParams } = input

  const markdown = await getMarkdownFromSlug<
    z.infer<typeof frontMatterSchema>['event'] & { title: string }
  >(pageRef)

  const {
    status,
    targetPageRef,
    rendered,
    lastModified,
    lastModifiedBy,
    frontMatter,
    file,
    perf,
  } = markdown

  let responseActions: ((response: AstroGlobal['response']) => void)[] = []

  if (
    status === 301 &&
    targetPageRef &&
    searchParams.get('redirect') !== 'no'
  ) {
    responseActions.push(response => {
      response.status = 301
      response.headers.set('Location', `/wiki/${targetPageRef}`)
    })
  } else if (status === 404) {
    responseActions.push(response => {
      response.status = 404
      response.headers.set('X-Astro-Reroute', 'no')
    })
  } else if (status === 500) {
    responseActions.push(response => {
      response.status = 500
      response.headers.set('X-Astro-Reroute', 'no')
    })
  }

  const frontMatterParsingResult = parseFrontMatter(frontMatter)
  const parsedFrontMatter = frontMatterParsingResult.success
    ? frontMatterParsingResult.data
    : undefined

  const pageTitle =
    frontMatter.title ||
    parsedFrontMatter?.event?.name ||
    formatPageRef(pageRef as string)
  const title = mode === 'view' ? pageTitle : 'Editor'
  const description = getWikiDescription(rendered?.html)
  const editable = !!file
  const editing = mode === 'editor' && editable ? file : null
  const contentHash = getContentHash(markdown)
  const ogImage = `https://screenshot.source.in.th/image/_/creatorsgarten-new-wiki/${pageRef}`

  let body: WikiPageViewModel['body']

  if (status === 200 || editing) {
    const commonProps: PageInfo = {
      pageRef,
      contentHash,
      title: pageTitle,
      headings: rendered?.headings || [],
      parsedFrontMatter,
      lastModified,
      lastModifiedBy,
      editable,
    }
    if (editing) {
      body = {
        ...commonProps,
        mode: 'editor',
        file: editing,
      }
    } else {
      const validationError = frontMatterParsingResult.success
        ? undefined
        : fromZodError(frontMatterParsingResult.error)
      const html = rendered?.html || ''
      const filePath = file?.path
      body = {
        ...commonProps,
        mode: 'view',
        html,
        validationError,
        filePath,
      }
    }
  } else {
    const html = rendered?.html || ''
    const filePath = file?.path
    body = {
      mode: 'simple',
      pageRef,
      contentHash,
      html,
      filePath,
      editable,
    }
  }

  return {
    respond: response => {
      for (const action of responseActions) {
        action(response)
      }
    },
    head: {
      title,
      description,
      ogImage,
    },
    body,
    perf,
  }
}
