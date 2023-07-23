import 'regenerator-runtime'
import { useEffect, useMemo, useState } from 'react'
import { EditorSettings } from './editorSettings'
import { useStore } from '@nanostores/react'
import { clsx } from 'clsx'
import { DumbTextarea } from './DumbTextarea'

interface EditorTextarea {
  editable: boolean
  defaultValue: string
}

export function EditorTextarea({ editable, defaultValue }: EditorTextarea) {
  const [mounted, setMounted] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const { font } = useStore(EditorSettings)

  function updateFont(e: React.ChangeEvent<HTMLInputElement>) {
    const checkbox = e.target as HTMLInputElement
    EditorSettings.setKey('font', checkbox.checked ? 'mono' : 'sans')
  }

  return (
    <>
      <div className={clsx('mb-2 flex gap-3', mounted ? '' : 'invisible')}>
        <label>
          <input
            type="checkbox"
            checked={font === 'mono'}
            onChange={updateFont}
          />{' '}
          Use monospace font
        </label>
        <label>
          <input
            type="checkbox"
            checked={advanced}
            onChange={e => setAdvanced(e.target.checked)}
          />{' '}
          Disable rich text editor
        </label>
      </div>

      <EditorView
        editable={editable}
        defaultValue={defaultValue}
        forceDumb={advanced}
      />
    </>
  )
}

interface EditorView {
  editable: boolean
  forceDumb: boolean
  defaultValue: string
}

function EditorView(props: EditorView) {
  const [UpgradedEditor, setUpgraded] = useState<
    typeof import('./UpgradedEditor').UpgradedEditor | undefined
  >()

  useEffect(() => {
    import('./UpgradedEditor').then(module => {
      setUpgraded(() => module.UpgradedEditor)
    })
  }, [])

  const { editable, defaultValue, forceDumb } = props

  const upgradedEditor = useMemo(() => {
    return UpgradedEditor ? (
      <UpgradedEditor defaultValue={defaultValue} />
    ) : null
  }, [UpgradedEditor, defaultValue])

  const dumbEditor = useMemo(() => {
    return (
      <DumbTextarea
        name="content"
        rows={40}
        disabled={!editable}
        defaultValue={defaultValue}
      />
    )
  }, [editable, defaultValue])

  return (editable && !forceDumb && upgradedEditor) || dumbEditor
}
