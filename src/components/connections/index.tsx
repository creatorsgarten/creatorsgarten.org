import { Discord } from './discord'
import { GitHub } from './github'
import { Bluesky } from './bluesky'

import type { FunctionComponent } from 'react'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'

interface Props {
  connections: AuthenticatedUser['connections']
}

export const Connections: FunctionComponent<Props> = props => {
  const { connections } = props

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-neutral-300 bg-white px-8 py-6">
        <h1 className="pb-4 text-center text-xl font-medium uppercase">
          Connections
        </h1>
        <div className="space-y-4">
          <GitHub connection={connections.github} />
          <Discord connection={connections.discord} />
          <Bluesky connection={connections.bluesky} />
        </div>
      </div>
    </section>
  )
}
