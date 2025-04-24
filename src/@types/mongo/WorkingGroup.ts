import { ObjectId } from 'mongodb'

export interface WorkingGroup {
  /** Working group name (without the WorkingGroups/ prefix) */
  name: string
  /** When the group was created */
  createdAt: Date
  /** User ID who created the group */
  createdBy: ObjectId
  /** User IDs with admin privileges */
  admins: ObjectId[]
  /** Invite keys for joining the group */
  inviteKeys: {
    /** Generated invite key */
    key: string
    /** Whether the invite is active */
    enabled: boolean
    /** When the invite was created */
    createdAt: Date
    /** Who created the invite */
    createdBy: ObjectId
  }[]
  /** Fields to collect from user profiles */
  profileFields: string[]
  /** Custom questions for members to answer when joining */
  customQuestions: {
    /** Unique ID for the question */
    id: string
    /** Question text */
    text: string
    /** Whether answering is required */
    required: boolean
  }[]
}
