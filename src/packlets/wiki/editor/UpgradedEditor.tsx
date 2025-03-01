import { useRef, useState } from 'react'
import { atom } from 'nanostores'
import { parseContentSections } from './contentSectionParser'
import { EditorSection } from './EditorSection'
import { HiddenContentInput } from './HiddenContentInput'
import { RichToolbar } from './RichToolbar'
import { RichTextEditor } from './RichTextEditor'

export interface UpgradedEditor {
  defaultValue: string
}

export function UpgradedEditor(props: UpgradedEditor) {
  const [contentAtom] = useState(atom(props.defaultValue))
  const sections = parseContentSections(props.defaultValue)
  const values = useRef<Record<string, string>>({})
  
  const onUpdateSection = (id: string, text: string) => {
    values.current[id] = text
    contentAtom.set(
      sections
        .map(section => {
          const text = values.current[section.id] ?? section.text
          return section.mode === 'rich' || section.id === 'frontmatter'
            ? text
            : `<!-- wysiwyg-ignore-start -->\n\n${text}\n\n<!-- wysiwyg-ignore-end -->`
        })
        .join('\n\n')
    )
  }
  
  return (
    <div className="flex flex-col gap-4">
      <HiddenContentInput atom={contentAtom} />
      {sections.map(section => (
        <EditorSection
          key={section.id}
          section={section}
          onChange={text => onUpdateSection(section.id, text)}
        />
      ))}
    </div>
  )
}

// Re-export components for backward compatibility
export { HiddenContentInput, RichToolbar, RichTextEditor, EditorSection }
