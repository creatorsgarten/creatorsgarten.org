export interface Section {
  id: string
  text: string
  mode: 'plain' | 'rich'
}

const frontMatterRegExp = /^\s*---\s*\n([\s\S]*?)\n\s*---\s*\n/
const wysiwygIgnoreRegExp = /<!--\s*wysiwyg-ignore-start\s*-->([\s\S]*?)<!--\s*wysiwyg-ignore-end\s*-->/

/**
 * Parses markdown content into sections that can be edited in rich or plain mode
 */
export function parseContentSections(text: string): Section[] {
  const output: Section[] = []
  
  // Extract frontmatter
  text = text.replace(frontMatterRegExp, a => {
    output.push({
      id: 'frontmatter',
      text: a,
      mode: 'plain',
    })
    return ''
  })
  
  // Parse the rest of the content
  const segments = text.split(wysiwygIgnoreRegExp)
  const bodySections = segments
    .map((text, i): Section => {
      return {
        id: `body${i}`,
        text: text.trim(),
        mode: i % 2 === 0 ? 'rich' : 'plain',
      }
    })
    .filter(section => section.text !== '')
  
  output.push(...bodySections)
  
  return output
}