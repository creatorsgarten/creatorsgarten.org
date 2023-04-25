import type { Element } from 'hast'

export const getHeadingsFromElement = (tree: Element): Element[] => {
  const headings = []

  if (
    tree.type === 'element' &&
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tree.tagName)
  ) {
    headings.push(tree)
  } else if (tree.type === 'element' && tree.children) {
    for (const node of tree?.children) {
      if (node.type === 'element') {
        headings.push(...getHeadingsFromElement(node))
      }
    }
  }

  return headings.flat(Infinity)
}
