import { Discord } from './discord'
import { Figma } from './figma'
import { GitHub } from './github'
import { Google } from './google'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { FunctionComponent } from 'react'

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
          <Google connection={connections.google} />
          <Figma connection={connections.figma} />
        </div>
      </div>
    </section>
  )
}
