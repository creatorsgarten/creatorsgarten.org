import { useEffect } from 'react'
import styles from './WikiExpandableLists.module.css'

export interface WikiExpandableLists {}

export default function WikiExpandableLists(props: WikiExpandableLists) {
  useEffect(() => {
    // Find all ul > li > p where the first text node starts with [+]
    const listItems = document.querySelectorAll('ul > li')

    for (const li of listItems) {
      const firstChild = li.firstElementChild
      if (firstChild?.tagName === 'P') {
        const firstTextNode = firstChild.firstChild
        if (firstTextNode?.nodeType === Node.TEXT_NODE) {
          const text = firstTextNode.textContent?.trim()
          if (text?.startsWith('[+]')) {
            // Create checkbox to replace [+]
            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.className = styles.checkbox

            // Generate unique ID for accessibility
            const uniqueId = `expandable-${Math.random().toString(36).substr(2, 9)}`
            checkbox.id = uniqueId

            // Replace [+] with the checkbox
            const remainingText = text.slice(3).trim() // Remove '[+]' and any leading whitespace
            firstTextNode.textContent = remainingText

            // Insert checkbox at the beginning of the paragraph
            firstChild.insertBefore(checkbox, firstChild.firstChild)

            // Add a space after checkbox if there's remaining text
            if (remainingText) {
              firstChild.insertBefore(
                document.createTextNode(' '),
                firstTextNode
              )
            }
          }
        }
      }
    }
  }, [])

  return <></>
}
