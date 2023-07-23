import { TypistEditor, RichTextKit, Editor } from '@doist/typist'
import { useRef, useState } from 'react'
import { DumbTextarea } from './DumbTextarea'
import type { TypistEditorRef } from '@doist/typist'
import { Icon } from 'react-iconify-icon-wrapper'

// Split the text at <!-- wysiwym-start --> and <!-- wysiwym-end -->
// and create a section for each part.
interface Section {
  id: number
  text: string
  mode: 'dumb' | 'rich'
}

function split(text: string): Section[] {
  return text
    .split(/<!--\s*wysiwym-start\s*-->([\s\S]*)<!--\s*wysiwym-end\s*-->/)
    .map((text, i) => {
      return {
        id: i,
        text: text,
        mode: i % 2 === 0 ? 'dumb' : 'rich',
      }
    })
}

export interface UpgradedEditor {
  defaultValue: string
}
export function UpgradedEditor(props: UpgradedEditor) {
  const sections = split(props.defaultValue)
  return (
    <div className="flex flex-col gap-4">
      {sections.map(section => {
        if (section.mode === 'dumb') {
          return (
            <DumbTextarea
              key={section.id}
              defaultValue={section.text}
              rows={section.text.split('\n').length + 3}
            />
          )
        } else {
          return <RichTextEditor key={section.id} defaultValue={section.text} />
        }
      })}
    </div>
  )
}

interface RichTextEditor {
  defaultValue: string
}
function RichTextEditor(props: RichTextEditor) {
  const typistEditorRef = useRef<TypistEditorRef>(null)
  const editorAction = (action: (editor: Editor) => void) => {
    const editor = typistEditorRef.current?.getEditor()
    if (editor) {
      action(editor as any)
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
      />
    </div>
  )
}

export interface RichToolbar {
  buttons: { icon: string; onClick: () => void }[]
}

export function RichToolbar(props: RichToolbar) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-neutral-400 bg-neutral-100 p-1">
      {props.buttons.map((button, i) => (
        <button
          key={i}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-200"
          onClick={button.onClick}
        >
          <Icon icon={button.icon} />
        </button>
      ))}
    </div>
  )
}
