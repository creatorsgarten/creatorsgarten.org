import type { FunctionComponent } from 'react'
import type { GitHubConnection } from '$types/AuthenticatedUser'

export interface Props {
  connection: GitHubConnection
}

export const GitHub: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <div className="flex justify-between items-center">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">GitHub</p>
        <p className="text-sm -mt-1">
          {connection
            ? 'Connected with @' + connection.username
            : 'Not connected'}
        </p>
      </div>
      <a
        href="/auth/connect/github"
        className="uppercase py-2 px-4 rounded-lg bg-neutral-700 text-white"
      >
        {connection ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}
