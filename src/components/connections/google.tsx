import type { FunctionComponent } from 'react'

import type { GoogleConnection } from '$types/mongo/User/GoogleConnection'

export interface Props {
  connection: GoogleConnection
}

export const Google: FunctionComponent<Props> = props => {
  const { connection } = props

  return (
    <div className="flex items-center justify-between">
      <div className="leading-none">
        <p className="inline-flex items-center text-lg font-medium">Google</p>
        <p className="-mt-1 text-sm">
          {connection ? 'Connected with ' + connection.email : 'Not connected'}
        </p>
      </div>
      <a
        href="/auth/connect/google"
        className="rounded-md bg-neutral-700 px-4 py-2 text-white uppercase"
      >
        {connection ? 'Reconnect' : 'Connect'}
      </a>
    </div>
  )
}
