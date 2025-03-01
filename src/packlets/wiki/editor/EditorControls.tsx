import { clsx } from 'clsx'
import { type ChangeEvent } from 'react'

export interface EditorControlsProps {
  mounted: boolean
  font: string
  updateFont: (e: ChangeEvent<HTMLInputElement>) => void
  forcePlain: boolean
  setForcePlain: (forcePlain: boolean) => void
}

/**
 * Editor control options for font and editor type
 */
export function EditorControls(props: EditorControlsProps) {
  const { mounted, font, updateFont, forcePlain, setForcePlain } = props
  
  return (
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
          checked={forcePlain}
          onChange={e => {
            setForcePlain(e.target.checked)
          }}
        />{' '}
        Use plain text editor
      </label>
    </div>
  )
}