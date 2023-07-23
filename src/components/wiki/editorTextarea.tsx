import { EditorSettings } from './editorSettings'
import { useStore } from '@nanostores/react'

interface EditorTextareaProps {
  editable: boolean
  defaultValue: string
}

export function EditorTextarea({
  editable,
  defaultValue,
}: EditorTextareaProps) {
  const { font } = useStore(EditorSettings)

  function updateFont(e: React.ChangeEvent<HTMLInputElement>) {
    const checkbox = e.target as HTMLInputElement
    EditorSettings.setKey('font', checkbox.checked ? 'mono' : 'sans')
  }

  return (
    <>
      <div className="mb-2 flex gap-2">
        <label>
          <input
            type="checkbox"
            checked={font === 'mono'}
            onChange={updateFont}
          />{' '}
          Use monospace font
        </label>
      </div>

      <textarea
        name="content"
        className={`w-full p-4 ${
          font === 'mono' ? 'font-mono' : 'font-prose'
        } rounded-xl border-2 border-black text-sm disabled:cursor-not-allowed ${
          editable ? '' : ''
        }`}
        disabled={!editable}
        rows={40}
        defaultValue={defaultValue}
      />
    </>
  )
}
