export interface AuthenticatedUser {
  uid: number
  name: string
  avatar: string
  email: string
  connections: {
    github: {
      username: string
    } | null
  }
}
