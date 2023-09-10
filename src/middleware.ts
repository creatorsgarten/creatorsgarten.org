import { sequence } from 'astro/middleware'

import { backendMiddleware } from '$functions/middleware/backend'
import { userMiddleware } from '$functions/middleware/user'

export const onRequest = sequence(backendMiddleware, userMiddleware)
