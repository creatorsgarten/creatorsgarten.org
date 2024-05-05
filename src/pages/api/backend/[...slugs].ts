import { backend } from 'src/backend'
import type { APIRoute } from 'astro'

const handle = ({ request }: { request: Request }) => backend.handle(request)

export const ALL: APIRoute = handle
