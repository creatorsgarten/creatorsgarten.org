import { Html } from '@contentsgarten/html'
import type { ReactNode } from 'react'
import { MarkdownLink } from '../link'
import { MarkdownImage } from '../image'
import { customComponents } from '../customComponents'
import { getAvatarUrl } from './getAvatarUrl.ts'

export interface MessageProps {
  label?: string
  children?: ReactNode
  attributes: {
    from: string
  }
}

/**
 * Renders a message from a specified person/source with an avatar
 */
export function Message(props: MessageProps) {
  return (
    <div className="my-[1em] flex items-start gap-6">
      <div className="not-prose flex-none">
        <MarkdownImage
          src={getAvatarUrl(props.attributes.from)}
          width={28}
          height={28}
          className="mt-0.5 h-8 w-8 rounded-full"
          alt={props.attributes.from}
        />
      </div>
      <div className="relative rounded-sm border bg-white px-2 py-1">
        {!!props.label && (
          <Html
            html={`${props.label}`}
            renderLink={props => MarkdownLink(props)}
            customComponents={customComponents}
            className="inline"
          />
        )}{' '}
        <span className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {props.children}
        </span>
        <cite className="text-sm not-italic text-neutral-500">
          —{props.attributes.from}
        </cite>
        <div className="absolute left-[-14px] top-[10px] h-[14px] w-[14px] border-[7px] border-transparent border-r-neutral-300"></div>
        <div className="absolute left-[-12.586px] top-[10px] h-[14px] w-[14px] border-[7px] border-transparent border-r-white"></div>
      </div>
    </div>
  )
}
