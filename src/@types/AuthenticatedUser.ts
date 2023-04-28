export interface AuthenticatedUser {
  uid: number
  name: string
  avatar: string
  email: string
  connections: {
    github: {
      id: number
      username: string
    } | null
  }
}
