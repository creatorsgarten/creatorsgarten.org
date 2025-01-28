import type { FunctionComponent } from 'react'

import type { DiscordConnection } from '$types/mongo/User/DiscordConnection'

export interface Props {
  connection: DiscordConnection
}

export const Discord: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <div className="flex items-center justify-between">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">Discord</p>
        <p className="-mt-1 text-sm">
          {connection
            ? 'Connected with @' + connection.username
            : 'Not connected'}
        </p>
      </div>
      <a
        href="/auth/connect/discord"
        className="rounded-md bg-neutral-700 px-4 py-2 uppercase text-white"
      >
        {connection ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}
