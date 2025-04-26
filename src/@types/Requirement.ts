export interface Requirement {
  displayName: string
  met: boolean
  explanation?: string
  callToAction?: {
    text: string
    url: string
  }
} 