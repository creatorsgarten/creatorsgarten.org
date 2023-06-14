import type { AuthenticatedUser } from '$types/AuthenticatedUser'

export const checkAccess = async (user: AuthenticatedUser | null) => {
  if (!user) {
    return { granted: false, reason: 'You are not logged in.' }
  }
  return {
    granted: [
      'rayriffy',
      'dtinth',
      'heypoom',
      'chayapatr',
      'leomotors',
      'chunrapeepat',
      'narze',
      'betich',
      'amiphaphadha',
      'pavitpim40',
      'jabont',
      'ibsfb',
      'saltyaom',
      'panj',
    ].includes(user.connections.github?.username.toLowerCase() ?? ''),
    reason: 'TODO',
  }
}
