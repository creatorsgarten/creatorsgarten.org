import type { FunctionComponent } from 'react'

import type { DiscordConnection } from '$types/mongo/User/DiscordConnection'

export interface Props {
  connection: DiscordConnection
}

export const Discord: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <div className="flex justify-between items-center">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">Discord</p>
        <p className="text-sm -mt-1">
          {connection
            ? 'Connected with @' + connection.username
            : 'Not connected'}
        </p>
      </div>
      <a
        href="/auth/connect/discord"
        className="uppercase py-2 px-4 rounded-lg bg-neutral-700 text-white"
      >
        {connection ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}
