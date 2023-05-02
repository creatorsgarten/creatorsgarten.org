import type { HTMLAttributes } from 'react'

export const MarkdownCode = async (content: string) => {
  const providers = await fetch('https://oembed.com/providers.json').then(o =>
    o.json()
  )

  return (props: HTMLAttributes<HTMLElement>) => {
    return <p>{JSON.stringify(providers)}</p>
  }
}
