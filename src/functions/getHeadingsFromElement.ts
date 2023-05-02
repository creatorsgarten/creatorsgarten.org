import type { Element } from 'hast'

export const getHeadingsFromElement = (tree: Element): Element[] => {
  const targetNodes = []

  if (
    tree.type === 'element' &&
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tree.tagName)
  ) {
    targetNodes.push(tree)
  } else if (tree.type === 'element' && tree.children) {
    for (const node of tree?.children) {
      if (node.type === 'element') {
        targetNodes.push(...getHeadingsFromElement(node))
      }
    }
  }

  return targetNodes.flat(Infinity)
}
