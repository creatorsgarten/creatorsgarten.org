import { PlainTextarea } from './PlainTextarea'
import { RichTextEditor } from './RichTextEditor'
import { type Section } from './contentSectionParser'

export interface EditorSectionProps {
  section: Section
  onChange: (text: string) => void
}

/**
 * Renders either a plain textarea or a rich text editor based on section mode
 */
export function EditorSection(props: EditorSectionProps) {
  const { section } = props
  
  if (section.mode === 'plain') {
    return (
      <PlainTextarea
        defaultValue={section.text}
        rows={section.text.split('\n').length + 3}
        onChange={e => props.onChange(e.target.value)}
      />
    )
  } else {
    return (
      <RichTextEditor defaultValue={section.text} onChange={props.onChange} />
    )
  }
}