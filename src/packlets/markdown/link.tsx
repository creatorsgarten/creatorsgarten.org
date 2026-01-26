import type { ReactNode } from 'react'
import { CurrentHrefContext } from './currentHrefContext'

interface Props {
  href: string
  children: ReactNode
  className?: string
}

export const MarkdownLink = (props: Props) => {
  if (['http://', 'https://', '//'].some(o => props.href.startsWith(o)))
    return <a {...props} />
  else
    return (
      <CurrentHrefContext.Consumer>
        {currentHref => (
          <a
            rel="prefetch"
            {...props}
            className={
              (props.className || '') +
              (currentHref === props.href
                ? ' cursor-default font-medium text-inherit'
                : '')
            }
          />
        )}
      </CurrentHrefContext.Consumer>
    )
}
