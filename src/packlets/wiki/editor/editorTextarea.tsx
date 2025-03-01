import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { EditorSettings } from './editorSettings'
import { EditorView } from './EditorView'
import { EditorControls } from './EditorControls'

export interface EditorTextareaProps {
  editable: boolean
  defaultValue: string
}

export interface EditorInitData {
  forcePlain: boolean
  defaultValue: string
}

/**
 * Main editor component that combines controls and the editor view
 */
export function EditorTextarea(props: EditorTextareaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [initData, setInitData] = useState<EditorInitData>(() => ({
    forcePlain: true,
    defaultValue: props.defaultValue,
  }))

  const setForcePlain = (forcePlain: boolean) => {
    const content = ref.current?.querySelector<HTMLInputElement>('[name="content"]')
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
      <EditorControls
        mounted={mounted}
        font={font}
        updateFont={updateFont}
        forcePlain={initData.forcePlain}
        setForcePlain={setForcePlain}
      />

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
