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
  const styles = {
    success: {
      '--infobox-bg': 'rgb(240, 253, 244)',
      '--infobox-icon-color': 'rgb(34, 197, 94)',
      '--infobox-title-color': 'rgb(22, 101, 52)',
      '--infobox-text-color': 'rgb(21, 128, 61)',
    },
    warning: {
      '--infobox-bg': 'rgb(254, 252, 232)',
      '--infobox-icon-color': 'rgb(234, 179, 8)',
      '--infobox-title-color': 'rgb(133, 77, 14)',
      '--infobox-text-color': 'rgb(161, 98, 7)',
    },
    error: {
      '--infobox-bg': 'rgb(254, 242, 242)',
      '--infobox-icon-color': 'rgb(239, 68, 68)',
      '--infobox-title-color': 'rgb(153, 27, 27)',
      '--infobox-text-color': 'rgb(185, 28, 28)',
    },
    info: {
      '--infobox-bg': 'rgb(239, 246, 255)',
      '--infobox-icon-color': 'rgb(59, 130, 246)',
      '--infobox-title-color': 'rgb(30, 64, 175)',
      '--infobox-text-color': 'rgb(29, 78, 216)',
    },
  }

  const iconName =
    type === 'success' ? 'heroicons:check-circle' :
    type === 'warning' ? 'heroicons:exclamation-triangle' :
    type === 'error' ? 'heroicons:x-circle' :
    'heroicons:information-circle'

  return (
    <div
      className="infobox-container rounded-md p-4"
      style={styles[type] as React.CSSProperties}
    >
      <div className="flex">
        <div className="shrink-0 infobox-icon">
          <Icon icon={icon || iconName} className="h-5 w-5" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium infobox-title">
              {title}
            </h3>
          )}
          <div className="mt-2 text-sm infobox-text">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
