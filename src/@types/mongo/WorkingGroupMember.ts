import { ObjectId } from 'mongodb'

export interface ProfileSnapshot {
  name: string
  email: string
  figmaEmail?: string
  githubUsername?: string
  discordName?: string
  googleAccount?: string
}

export interface WorkingGroupMember {
  /** Reference to workingGroups collection */
  groupId: ObjectId
  /** Reference to users collection */
  userId: ObjectId
  /** When the user joined the group */
  joinedAt: Date
  /** Copy of user profile at join time */
  profileSnapshot: ProfileSnapshot
  questionResponses: {
    questionId: string
    response: string
  }[]
}
