import type { FunctionComponent } from 'react'

import { Connection } from './Connection'
import type { GitHubConnection } from '$types/mongo/User/GitHubConnection'

export interface Props {
  connection: GitHubConnection
}

export const GitHub: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <Connection
      id="github"
      serviceName="GitHub"
      displayText={connection ? 'Connected with @' + connection.username : ''}
      connectUrl="/auth/connect/github"
      isConnected={!!connection}
    />
  )
}
