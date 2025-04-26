import { getContentsgarten } from '../getContentsgarten'
import prettier from '@prettier/sync'
import { updateWiki } from './updateWiki'
import matter from 'gray-matter'
import type { AstroGlobal } from 'astro'
import type { FrontMatterInput } from '$functions/parseFrontMatter'
import { dump } from 'js-yaml'

type FrontMatterCallback = (frontmatter: FrontMatterInput) => void

/**
 * Simple deep equality check for objects
 */
function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/**
 * Update frontmatter in a wiki page
 * @param pageRef Wiki page reference (path)
 * @param modifyFn Callback function that modifies the frontmatter object
 * @param Astro Astro global context for authentication and redirects
 * @returns The result of the operation (success or error information)
 */
export async function updateFrontMatter(
  pageRef: string,
  modifyFn: FrontMatterCallback,
  Astro: AstroGlobal
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get contentsgarten client
    const wiki = getContentsgarten(Astro)

    // Get current page content
    const wikiPage = await wiki.view.query({
      pageRef,
      withFile: true,
      revalidate: true,
    })

    if (!wikiPage?.file) {
      return {
        success: false,
        error: 'Page not found or not accessible',
      }
    }

    // Parse current content with gray-matter
    const existingContent = wikiPage.file.content || ''
    const parsedContent = matter(existingContent)

    // Clone frontmatter data to avoid direct mutations
    const oldFrontmatter = JSON.parse(JSON.stringify({ ...parsedContent.data }))
    const newFrontmatter = JSON.parse(JSON.stringify({ ...parsedContent.data }))

    // Apply modifications to the cloned frontmatter
    modifyFn(newFrontmatter)

    // Check if frontmatter actually changed
    if (isEqual(oldFrontmatter, newFrontmatter)) {
      return { success: true } // No changes needed
    }

    // Create updated content with new frontmatter
    const updatedContent = matter.stringify(
      parsedContent.content,
      newFrontmatter,
      {
        engines: {
          yaml: {
            ...(matter as any).engines.yaml,
            stringify: (data: any) =>
              prettier
                .format(dump(data, { lineWidth: -1 }), { parser: 'yaml' })
                .trimEnd(),
          },
        },
      }
    )

    // Save updated content using updateWiki (which handles caching)
    await updateWiki(pageRef, updatedContent, wikiPage.file.revision, Astro)

    return { success: true }
  } catch (error) {
    console.error('Error updating frontmatter:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update frontmatter',
    }
  }
}
