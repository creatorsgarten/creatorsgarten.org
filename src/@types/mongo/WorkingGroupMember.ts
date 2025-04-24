import { ObjectId } from 'mongodb'

export interface WorkingGroupMember {
  /** MongoDB ObjectId */
  _id: ObjectId
  /** Reference to workingGroups collection */
  groupId: ObjectId
  /** Reference to users collection */
  userId: ObjectId
  /** When the user joined the group */
  joinedAt: Date
  /** Copy of user profile at join time */
  profileSnapshot: {
    name: string
    email: string
    figmaEmail?: string
    githubUsername?: string
    discordName?: string
    googleAccount?: string
  }
  /** Responses to custom questions */
  questionResponses: {
    questionId: string
    response: string
  }[]
}
