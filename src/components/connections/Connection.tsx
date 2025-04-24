import type { FunctionComponent, ReactNode } from 'react'

export interface ConnectionProps {
  id: string
  serviceName: string
  displayText: string
  connectUrl: string
  isConnected: boolean
}

/**
 * Shared connection component with consistent UI
 */
export const Connection: FunctionComponent<ConnectionProps> = (props) => {
  const { id, serviceName, displayText, connectUrl, isConnected } = props

  return (
    <div id={id} className="flex items-center justify-between">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">{serviceName}</p>
        <p className="-mt-1 text-sm">
          {isConnected ? displayText : 'Not connected'}
        </p>
      </div>
      <a
        href={connectUrl}
        className="rounded-md bg-neutral-700 px-4 py-2 uppercase text-white"
      >
        {isConnected ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}