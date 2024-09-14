import { atom, type WritableAtom } from 'nanostores'

export interface UploadState {
  log: string
  previewUrl?: string
  result?: UploadResult
}

export interface UploadResult {
  url: string
  description: string
}

export interface Upload {
  id: string
  file: File
  $state: WritableAtom<UploadState>
}

export const $uploads = atom<Upload[]>([])
