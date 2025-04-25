import { parseFrontMatter, type FrontMatter } from '$functions/parseFrontMatter'
import type { ContentsgartenOutput } from '$types/ContentsgartenOutput'
import type { AstroGlobal } from 'astro'
import { fromZodError, type ValidationError } from 'zod-validation-error'
import { formatPageRef } from './formatPageRef'
import { getContentHash, getMarkdownFromSlug } from './getMarkdownFromSlug'
import { getWikiDescription } from './getWikiDescription'
import { applyResponseActions, type ResponseAction } from './responseHandler'

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

/**
 * Process wiki page data and generate a view model for rendering
 */
export async function getWikiPageViewModel(input: {
  pageRef: string
  mode: 'view' | 'editor'
  searchParams: URLSearchParams
}): Promise<WikiPageViewModel> {
  const { pageRef, mode, searchParams } = input

  // Get markdown content
  const markdown = await getMarkdownFromSlug<FrontMatter>(pageRef)

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

  // Determine response actions based on status
  const responseActions: ResponseAction[] = getResponseActions(
    status,
    targetPageRef,
    searchParams.get('redirect') !== 'no'
  )

  // Parse front matter
  const frontMatterParsingResult = parseFrontMatter(frontMatter)
  const parsedFrontMatter = frontMatterParsingResult.success
    ? frontMatterParsingResult.data
    : undefined

  // Prepare metadata
  const pageTitle = getPageTitle(frontMatter, parsedFrontMatter, pageRef)
  const title = mode === 'view' ? pageTitle : 'Editor'
  const description = getWikiDescription(rendered?.html)
  const editable = !!file
  const editing = mode === 'editor' && editable ? file : null
  const contentHash = getContentHash(markdown)
  const ogImage = `https://screenshot.source.in.th/image/_/creatorsgarten-new-wiki/${pageRef}`

  // Create the appropriate body type based on mode and status
  const body = createBodyContent({
    status,
    editing,
    pageRef,
    contentHash,
    pageTitle,
    rendered,
    parsedFrontMatter,
    lastModified,
    lastModifiedBy,
    editable,
    frontMatterParsingResult,
    file,
  })

  return {
    respond: response => applyResponseActions(response, responseActions),
    head: {
      title,
      description,
      ogImage,
    },
    body,
    perf,
  }
}

/**
 * Get response actions based on status and target page
 */
function getResponseActions(
  status: number,
  targetPageRef?: string,
  allowRedirect: boolean = true
): ResponseAction[] {
  const actions: ResponseAction[] = []

  if (status === 301 && targetPageRef && allowRedirect) {
    actions.push({
      status: 301,
      headers: { Location: `/wiki/${targetPageRef}` },
    })
  } else if (status === 404 || status === 500) {
    actions.push({
      status,
      headers: { 'X-Astro-Reroute': 'no' },
    })
  }

  return actions
}

/**
 * Get the page title from available sources
 */
function getPageTitle(
  frontMatter: Record<string, any>,
  parsedFrontMatter?: FrontMatter,
  pageRef?: string
): string {
  return (
    frontMatter.title ||
    parsedFrontMatter?.event?.name ||
    formatPageRef(pageRef as string)
  )
}

/**
 * Create the appropriate body content based on status and mode
 */
function createBodyContent(params: {
  status: number
  editing: EditingFile | null
  pageRef: string
  contentHash: string
  pageTitle: string
  rendered: ContentsgartenOutput['view']['rendered'] | undefined
  parsedFrontMatter?: FrontMatter
  lastModified?: string
  lastModifiedBy?: string[]
  editable: boolean
  frontMatterParsingResult: ReturnType<typeof parseFrontMatter>
  file: { path: string; content: string; revision?: string } | undefined
}): WikiPageViewModel['body'] {
  const {
    status,
    editing,
    pageRef,
    contentHash,
    pageTitle,
    rendered,
    parsedFrontMatter,
    lastModified,
    lastModifiedBy,
    editable,
    frontMatterParsingResult,
    file,
  } = params

  // Normal view or editor view
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
      return {
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

      return {
        ...commonProps,
        mode: 'view',
        html,
        validationError,
        filePath,
      }
    }
  }
  // Simple view for error states
  else {
    const html = rendered?.html || ''
    const filePath = file?.path

    return {
      mode: 'simple',
      pageRef,
      contentHash,
      html,
      filePath,
      editable,
    }
  }
}
