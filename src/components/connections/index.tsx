import type { FunctionComponent } from 'react'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { GitHub } from './github'

interface Props {
  user: AuthenticatedUser
}

export const Connections: FunctionComponent<Props> = props => {
  const { connections } = props.user

  return (
    <section className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl py-6 px-8 border border-neutral-300">
        <h1 className="font-medium text-xl uppercase pb-4 text-center">
          Connections
        </h1>
        <div className="space-y-4">
          <GitHub connection={connections.github} />
        </div>
      </div>
    </section>
  )
}
