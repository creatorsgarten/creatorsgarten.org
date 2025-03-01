import { Icon } from 'react-iconify-icon-wrapper'

export interface ToolbarButton {
  icon: string
  onClick: () => void
}

export interface RichToolbarProps {
  buttons: ToolbarButton[]
}

/**
 * Toolbar for the rich text editor with formatting buttons
 */
export function RichToolbar(props: RichToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-neutral-400 bg-neutral-100 p-1">
      {props.buttons.map((button, i) => (
        <button
          key={i}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-200"
          onClick={button.onClick}
        >
          <Icon icon={button.icon} />
        </button>
      ))}
    </div>
  )
}