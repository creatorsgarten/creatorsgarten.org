import { z } from 'zod'

// Username validation rules as per issue #1405
// - Lowercase alphanumeric characters only [a-z0-9]
// - Minimum 3 characters, maximum 30 characters
// - Must not conflict with existing paths or reserved words

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(
    /^[a-z0-9]+$/,
    'Username must contain only lowercase letters and numbers'
  )

// Reserved words that cannot be used as usernames
export const reservedUsernames = [
  'admin',
  'api',
  'auth',
  'dashboard',
  'events',
  'login',
  'logout',
  'register',
  'settings',
  'wiki',
  'about',
  'contact',
  'help',
  'privacy',
  'terms',
  'user',
  'users',
  'creatorsgarten',
  'garten',
]

export const validateUsername = (username: string) => {
  try {
    usernameSchema.parse(username)
    if (reservedUsernames.includes(username.toLowerCase())) {
      return { valid: false, message: 'This username is reserved' }
    }
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, message: error.errors[0].message }
    }
    return { valid: false, message: 'Invalid username' }
  }
}
