import type { FunctionComponent } from 'react'

import { Connection } from './Connection'
import type { GoogleConnection } from '$types/mongo/User/GoogleConnection'

export interface Props {
  connection: GoogleConnection
}

export const Google: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <Connection
      id="google"
      serviceName="Google"
      displayText={connection ? 'Connected with ' + connection.email : ''}
      connectUrl="/auth/connect/google"
      isConnected={!!connection}
    />
  )
}
