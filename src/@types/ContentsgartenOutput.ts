import type { inferRouterOutputs } from '@trpc/server'
import type { ContentsgartenRouter } from 'contentsgarten'

export type ContentsgartenOutput = inferRouterOutputs<ContentsgartenRouter>
