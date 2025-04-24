import type { FunctionComponent } from 'react'

import { Connection } from './Connection'
import type { FigmaConnection } from '$types/mongo/User/FigmaConnection'

export interface Props {
  connection: FigmaConnection
}

export const Figma: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <Connection
      id="figma"
      serviceName="Figma"
      displayText={connection ? 'Connected with ' + connection.email : ''}
      connectUrl="/auth/connect/figma"
      isConnected={!!connection}
    />
  )
}
