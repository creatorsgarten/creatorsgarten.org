import { TypistEditor, RichTextKit, Editor } from '@doist/typist'
import { useRef, useState } from 'react'
import { PlainTextarea } from './PlainTextarea'
import type { TypistEditorRef } from '@doist/typist'
import { Icon } from 'react-iconify-icon-wrapper'
import { ReadableAtom, atom } from 'nanostores'
import { useStore } from '@nanostores/react'

export interface UpgradedEditor {
  defaultValue: string
}
export function UpgradedEditor(props: UpgradedEditor) {
  const [contentAtom] = useState(atom(props.defaultValue))
  const sections = split(props.defaultValue)
  const values = useRef<Record<string, string>>({})
  const onUpdateSection = (id: string, text: string) => {
    values.current[id] = text
    contentAtom.set(
      sections
        .map(section => {
          const text = values.current[section.id] ?? section.text
          return section.mode === 'rich' || section.id === 'frontmatter'
            ? text
            : `<!-- wysiwyg-ignore-start -->\n\n${text}\n\n<!-- wysiwyg-ignore-end -->`
        })
        .join('\n\n')
    )
  }
  return (
    <div className="flex flex-col gap-4">
      <HiddenContentInput atom={contentAtom} />
      {sections.map(section => (
        <EditorSection
          key={section.id}
          section={section}
          onChange={text => onUpdateSection(section.id, text)}
        />
      ))}
    </div>
  )
}

export interface HiddenContentInput {
  atom: ReadableAtom<string>
}
export function HiddenContentInput(props: HiddenContentInput) {
  const value = useStore(props.atom)
  return <input type="hidden" value={value} name="content" />
}

interface EditorSection {
  section: Section
  onChange: (text: string) => void
}
function EditorSection(props: EditorSection) {
  const { section } = props
  if (section.mode === 'plain') {
    return (
      <PlainTextarea
        defaultValue={section.text}
        rows={section.text.split('\n').length + 3}
        onChange={e => props.onChange(e.target.value)}
      />
    )
  } else {
    return (
      <RichTextEditor defaultValue={section.text} onChange={props.onChange} />
    )
  }
}

interface RichTextEditor {
  defaultValue: string
  onChange: (text: string) => void
}
function RichTextEditor(props: RichTextEditor) {
  const typistEditorRef = useRef<TypistEditorRef>(null)
  const editorAction = (action: (editor: Editor) => void) => {
    const editor = typistEditorRef.current?.getEditor()
    if (editor) {
      action(editor as any)
    }
  }
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

interface Section {
  id: string
  text: string
  mode: 'plain' | 'rich'
}

const frontMatterRegExp = /^\s*---\s*\n([\s\S]*?)\n\s*---\s*\n/
function split(text: string): Section[] {
  const output: Section[] = []
  text = text.replace(frontMatterRegExp, a => {
    output.push({
      id: 'frontmatter',
      text: a,
      mode: 'plain',
    })
    return ''
  })
  output.push(
    ...text
      .split(
        /<!--\s*wysiwyg-ignore-start\s*-->([\s\S]*?)<!--\s*wysiwyg-ignore-end\s*-->/
      )
      .map((text, i): Section => {
        return {
          id: `body${i}`,
          text: text.trim(),
          mode: i % 2 === 0 ? 'rich' : 'plain',
        }
      })
      .filter(section => section.text !== '')
  )
  return output
}
