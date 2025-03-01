import { useEffect, useMemo, useState } from 'react'
import { PlainTextarea } from './PlainTextarea'

export interface EditorViewProps {
  editable: boolean
  forcePlain: boolean
  defaultValue: string
}

/**
 * Conditional editor view that loads either the rich editor or plain editor
 */
export function EditorView(props: EditorViewProps) {
  const [UpgradedEditor, setUpgraded] = useState<
    typeof import('./UpgradedEditor').UpgradedEditor | undefined
  >()

  // Lazy-load the upgraded editor component
  useEffect(() => {
    import('./UpgradedEditor').then(module => {
      setUpgraded(() => module.UpgradedEditor)
    })
  }, [])

  const { editable, defaultValue, forcePlain } = props

  // Memoize the editor instances to prevent unnecessary re-renders
  const upgradedEditor = useMemo(() => {
    return UpgradedEditor ? (
      <UpgradedEditor defaultValue={defaultValue} />
    ) : null
  }, [UpgradedEditor, defaultValue])

  const plainEditor = useMemo(() => {
    return (
      <PlainTextarea
        name="content"
        rows={40}
        disabled={!editable}
        defaultValue={defaultValue}
      />
    )
  }, [editable, defaultValue])

  // Show the appropriate editor based on the flags
  return (editable && !forcePlain && upgradedEditor) || plainEditor
}