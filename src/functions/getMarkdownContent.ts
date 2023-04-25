import { rehype } from 'rehype'
import rehypeSlug from 'rehype-slug'
import { renderMarkdown } from '@contentsgarten/markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { Root, RootContent } from 'hast'

import { getHeadingsFromElement  } from '../functions/getHeadingsFromTree'

export const getMarkdownContent = async (
  markdown: string
) => {
  const rendered = renderMarkdown(markdown)

  let ids: { id: string, label: string }[] = []

  const modRendered = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(() => (tree: Root) => {
      tree.children
        .filter(o => o.type === 'element')
        .map(o => getHeadingsFromElement(o as any))
        .flat()
        .map(node => {
          ids.push({
            id: node?.properties?.id?.toString() ?? '',
            // @ts-ignore
            label: node.children.find(o => o.type === 'text')?.value ?? '',
          })
        })
    })
    .process(rendered)

  return {
    ids,
    content: modRendered.toString(),
  }
}
