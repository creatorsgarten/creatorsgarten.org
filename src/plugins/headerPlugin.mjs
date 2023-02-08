/** @type {import('@astrojs/markdown-remark').RemarkPlugin} */
export const headerPlugin = () => {
  return async markdownAST => {
    // get h1 header
    const nodes = markdownAST.children.filter(
      o => o.type === 'heading' && o.depth === 1
    )

    // override styles
    nodes.map(node => {
      node.type = 'html'
      node.value = `<div class="relative flex mt-10 py-2 items-center">
        <div class="flex-grow border-t border-gray-600"></div>
        <span class="flex-shrink text-xl mx-4 text-gray-600">${node.children[0].value}</span>
        <div class="flex-grow border-t border-gray-600"></div>
      </div>`
      node.children = undefined
    })
  }
}
