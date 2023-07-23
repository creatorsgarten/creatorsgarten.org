import { useState } from 'react'
import { SlateTransformer } from '@accordproject/markdown-slate'

import {
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
} from '@udecode/plate-basic-marks'
import { createBlockquotePlugin } from '@udecode/plate-block-quote'
import { Plate, createPlugins } from '@udecode/plate-common'
import { createHeadingPlugin } from '@udecode/plate-heading'
import { createParagraphPlugin } from '@udecode/plate-paragraph'

const plugins = createPlugins(
  [
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createHeadingPlugin(),

    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
  ],
  {}
)

export interface UpgradedEditor {
  defaultValue: string
}
const slateTransformer = new SlateTransformer()

export function UpgradedEditor(props: UpgradedEditor) {
  const [slateValue, setSlateValue] = useState(() => {
    const slate = slateTransformer.fromMarkdown(props.defaultValue)
    console.log(slate)
    return slate.document.children
  })

  return (
    <>
      <Plate
        editableProps={{
          placeholder: 'Type some text here',
          className: 'prose mx-auto max-w-6xl',
        }}
        initialValue={slateValue}
        plugins={plugins}
      />
    </>
  )
}
