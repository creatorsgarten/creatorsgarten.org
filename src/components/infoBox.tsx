import { Icon } from 'react-iconify-icon-wrapper'
import React from 'react'

export type InfoBoxType = 'info' | 'success' | 'warning' | 'error'

export interface InfoBoxProps {
  type?: InfoBoxType
  title?: string
  children: React.ReactNode
  icon?: string
}

export function InfoBox({
  type = 'info',
  title,
  children,
  icon,
}: InfoBoxProps) {
  // Use inline styles with !important to override any conflicting styles
  const styles = {
    success: {
      container: 'rgb(240, 253, 244)',
      border: '1px solid rgb(187, 247, 208)',
      icon: 'rgb(34, 197, 94)',
      title: 'rgb(22, 101, 52)',
      text: 'rgb(21, 128, 61)',
    },
    warning: {
      container: 'rgb(254, 252, 232)',
      border: '1px solid rgb(254, 240, 138)',
      icon: 'rgb(234, 179, 8)',
      title: 'rgb(133, 77, 14)',
      text: 'rgb(161, 98, 7)',
    },
    error: {
      container: 'rgb(254, 242, 242)',
      border: '1px solid rgb(254, 202, 202)',
      icon: 'rgb(239, 68, 68)',
      title: 'rgb(153, 27, 27)',
      text: 'rgb(185, 28, 28)',
    },
    info: {
      container: 'rgb(239, 246, 255)',
      border: '1px solid rgb(191, 219, 254)',
      icon: 'rgb(59, 130, 246)',
      title: 'rgb(30, 64, 175)',
      text: 'rgb(29, 78, 216)',
    },
  }

  const style = styles[type]
  const iconName =
    type === 'success' ? 'heroicons:check-circle' :
    type === 'warning' ? 'heroicons:exclamation-triangle' :
    type === 'error' ? 'heroicons:x-circle' :
    'heroicons:information-circle'

  return (
    <div
      className="infobox-container rounded-md p-4"
      style={{
        backgroundColor: style.container,
        border: style.border,
      }}
    >
      <div className="flex">
        <div className="shrink-0 infobox-icon" style={{ color: style.icon }}>
          <Icon icon={icon || iconName} className="h-5 w-5" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium infobox-title" style={{ color: style.title }}>
              {title}
            </h3>
          )}
          <div className="mt-2 text-sm infobox-text" style={{ color: style.text }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
