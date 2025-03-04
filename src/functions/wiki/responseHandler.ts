import type { AstroGlobal } from 'astro'

export interface ResponseAction {
  status: number
  headers?: Record<string, string>
}

/**
 * Applies response actions to the Astro response object
 */
export function applyResponseActions(
  response: AstroGlobal['response'],
  actions: ResponseAction[]
): void {
  for (const action of actions) {
    response.status = action.status
    
    if (action.headers) {
      for (const [key, value] of Object.entries(action.headers)) {
        response.headers.set(key, value)
      }
    }
  }
}