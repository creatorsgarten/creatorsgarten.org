import type { ReactNode } from 'react'

interface Props {
  href: string;
  children: ReactNode
  className?: string
}

export const MarkdownLink = (props: Props) => {
  if (['http://', 'https://', '//'].some(o => props.href.startsWith(o)))
    return <a {...props} />
  else
    return <a rel="prefetch" {...props} />
}