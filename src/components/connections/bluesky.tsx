import type { FunctionComponent } from 'react'

import type { BlueskyConnection } from '$types/mongo/User/BlueskyConnection'

export interface Props {
  connection: BlueskyConnection
}

export const Bluesky: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <div className="flex items-center justify-between">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">Bluesky</p>
        <p className="-mt-1 text-sm">
          {connection
            ? 'Connected with @' + connection.username
            : 'Not connected'}
        </p>
      </div>
      <a
        href="/auth/connect/bluesky"
        className="rounded-lg bg-neutral-700 px-4 py-2 uppercase text-white"
      >
        {connection ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}
