import { persistentMap } from '@nanostores/persistent'

export type EditorSettings = {
  font: 'sans' | 'mono'
}

export const EditorSettings = persistentMap<EditorSettings>('editor:', {
  font: 'mono',
})
