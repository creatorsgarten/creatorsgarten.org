import { Icon } from 'react-iconify-icon-wrapper'
import React from 'react'

export type InfoBoxType = 'info' | 'success' | 'warning' | 'error'

export interface InfoBoxProps {
  type?: InfoBoxType
  title?: string
  children: React.ReactNode
  icon?: string
}

const typeConfig = {
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500',
    icon: 'heroicons:information-circle',
  },
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
    iconColor: 'text-green-400',
    icon: 'heroicons:check-circle',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-400',
    icon: 'heroicons:exclamation-triangle',
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
    iconColor: 'text-red-400',
    icon: 'heroicons:x-circle',
  },
}

export function InfoBox({
  type = 'info',
  title,
  children,
  icon,
}: InfoBoxProps) {
  const config = typeConfig[type]

  return (
    <div className={`rounded-md border ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon icon={icon || config.icon} className="h-5 w-5" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </h3>
          )}
          <div className={`mt-2 text-sm ${config.textColor}`}>{children}</div>
        </div>
      </div>
    </div>
  )
} 