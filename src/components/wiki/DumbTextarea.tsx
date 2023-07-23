import { EditorSettings } from './editorSettings'
import { useStore } from '@nanostores/react'

export interface DumbTextarea {
  name?: string
  rows?: number
  disabled?: boolean
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
}

export function DumbTextarea(props: DumbTextarea) {
  const { font } = useStore(EditorSettings)
  return (
    <textarea
      className={`w-full p-4 ${
        font === 'mono' ? 'font-mono' : 'font-prose'
      } rounded-xl border-2 border-black text-sm disabled:cursor-not-allowed`}
      rows={40}
      {...props}
    />
  )
}
