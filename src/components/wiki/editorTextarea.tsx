import 'regenerator-runtime'
import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorSettings } from './editorSettings'
import { useStore } from '@nanostores/react'
import { clsx } from 'clsx'
import { PlainTextarea } from './PlainTextarea'

interface EditorTextarea {
  editable: boolean
  defaultValue: string
}
interface EditorInitData {
  forcePlain: boolean
  defaultValue: string
}

export function EditorTextarea(props: EditorTextarea) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [initData, setInitData] = useState<EditorInitData>(() => ({
    forcePlain: false,
    defaultValue: props.defaultValue,
  }))

  const setForcePlain = (forcePlain: boolean) => {
    const content =
      ref.current?.querySelector<HTMLInputElement>('[name="content"]')
    setInitData({
      defaultValue: content?.value ?? props.defaultValue,
      forcePlain,
    })
  }

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
            checked={initData.forcePlain}
            onChange={e => {
              setForcePlain(e.target.checked)
            }}
          />{' '}
          Disable rich text editor
        </label>
      </div>

      <div ref={ref}>
        <EditorView
          editable={props.editable}
          defaultValue={initData.defaultValue}
          forcePlain={initData.forcePlain}
        />
      </div>
    </>
  )
}

interface EditorView {
  editable: boolean
  forcePlain: boolean
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

  const { editable, defaultValue, forcePlain: forceDumb } = props

  const upgradedEditor = useMemo(() => {
    return UpgradedEditor ? (
      <UpgradedEditor defaultValue={defaultValue} />
    ) : null
  }, [UpgradedEditor, defaultValue])

  const dumbEditor = useMemo(() => {
    return (
      <PlainTextarea
        name="content"
        rows={40}
        disabled={!editable}
        defaultValue={defaultValue}
      />
    )
  }, [editable, defaultValue])

  return (editable && !forceDumb && upgradedEditor) || dumbEditor
}
