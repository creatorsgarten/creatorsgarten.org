import type { FunctionComponent } from 'react'

import { Connection } from './Connection'
import type { DiscordConnection } from '$types/mongo/User/DiscordConnection'

export interface Props {
  connection: DiscordConnection
}

export const Discord: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <Connection
      id="discord"
      serviceName="Discord"
      displayText={connection ? 'Connected with @' + connection.username : ''}
      connectUrl="/auth/connect/discord"
      isConnected={!!connection}
    />
  )
}
