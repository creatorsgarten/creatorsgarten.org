import { type ReadableAtom } from 'nanostores'
import { useStore } from '@nanostores/react'

export interface HiddenContentInputProps {
  atom: ReadableAtom<string>
}

/**
 * A hidden input field that stores the editor content for form submission
 */
export function HiddenContentInput(props: HiddenContentInputProps) {
  const value = useStore(props.atom)
  return <input type="hidden" value={value} name="content" />
}