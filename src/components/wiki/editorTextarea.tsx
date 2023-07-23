import 'regenerator-runtime'
import { useEffect, useMemo, useState } from 'react'
import { EditorSettings } from './editorSettings'
import { useStore } from '@nanostores/react'
import { clsx } from 'clsx'
import { UpgradedEditor } from './UpgradedEditor'

interface EditorTextarea {
  editable: boolean
  defaultValue: string
}

export function EditorTextarea({ editable, defaultValue }: EditorTextarea) {
  const [upgraded, setUpgraded] = useState(false)
  useEffect(() => {
    setUpgraded(true)
  }, [])

  const { font } = useStore(EditorSettings)

  function updateFont(e: React.ChangeEvent<HTMLInputElement>) {
    const checkbox = e.target as HTMLInputElement
    EditorSettings.setKey('font', checkbox.checked ? 'mono' : 'sans')
  }

  return (
    <>
      <div className={clsx('mb-2 flex gap-2', upgraded ? '' : 'invisible')}>
        <label>
          <input
            type="checkbox"
            checked={font === 'mono'}
            onChange={updateFont}
          />{' '}
          Use monospace font
        </label>
      </div>

      <EditorView editable={editable} defaultValue={defaultValue} />
    </>
  )
}

export interface EditorView {
  editable: boolean
  defaultValue: string
}

export function EditorView(props: EditorView) {
  const [upgraded, setUpgraded] = useState(false)
  useEffect(() => {
    setUpgraded(true)
  }, [])

  const { editable, defaultValue } = props

  if (upgraded && editable) {
    return <UpgradedEditor defaultValue={defaultValue} />
  }

  return (
    <DumbTextarea
      name="content"
      rows={40}
      disabled={!editable}
      defaultValue={defaultValue}
    />
  )
}

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
