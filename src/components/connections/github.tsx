import type { FunctionComponent } from 'react'

import type { GitHubConnection } from '$types/mongo/User/GitHubConnection'

export interface Props {
  connection: GitHubConnection
}

export const GitHub: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <div className="flex items-center justify-between">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">GitHub</p>
        <p className="-mt-1 text-sm">
          {connection
            ? 'Connected with @' + connection.username
            : 'Not connected'}
        </p>
      </div>
      <a
        href="/auth/connect/github"
        className="rounded-lg bg-neutral-700 px-4 py-2 uppercase text-white"
      >
        {connection ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}
