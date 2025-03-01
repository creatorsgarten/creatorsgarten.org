import { TypistEditor, RichTextKit, type Editor } from '@doist/typist'
import { useRef } from 'react'
import type { TypistEditorRef } from '@doist/typist'
import { RichToolbar } from './RichToolbar'

export interface RichTextEditorProps {
  defaultValue: string
  onChange: (text: string) => void
}

/**
 * Rich text editor component based on Typist
 */
export function RichTextEditor(props: RichTextEditorProps) {
  const typistEditorRef = useRef<TypistEditorRef>(null)
  
  // Helper function to execute editor actions
  const editorAction = (action: (editor: Editor) => void) => {
    const editor = typistEditorRef.current?.getEditor()
    if (editor) {
      action(editor as any)
    }
  }
  
  // Handle content updates
  const handleUpdate = () => {
    if (typistEditorRef.current) {
      props.onChange(typistEditorRef.current.getMarkdown())
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-black text-sm disabled:cursor-not-allowed">
      <RichToolbar
        buttons={[
          {
            icon: 'octicon:bold-16',
            onClick: () =>
              editorAction(e => e.chain().focus().toggleBold().run()),
          },
          {
            icon: 'octicon:italic-16',
            onClick: () =>
              editorAction(e => e.chain().focus().toggleItalic().run()),
          },
        ]}
      />
      <TypistEditor
        placeholder="A full rich-text editor, be creative…"
        content={props.defaultValue}
        extensions={[RichTextKit]}
        className="prose mx-auto max-w-6xl [&>.ProseMirror]:p-4"
        ref={typistEditorRef}
        onUpdate={handleUpdate}
      />
    </div>
  )
}