interface AvatarItem {
  href?: string
  imageUrl: string
  imageAlt: string
}

export interface AvatarGridProps {
  items: AvatarItem[]
}

export function AvatarGrid({ items }: AvatarGridProps) {
  return (
    <div className="flex gap-2">
      {items.map((item, index) => {
        const isExternalLink = item.href?.includes('://')
        const avatar = (
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            className="h-8 w-8 rounded-full"
          />
        )

        if (!item.href) {
          return (
            <div
              key={index}
              className="block h-8 w-8 overflow-hidden rounded-full bg-black/10"
            >
              {avatar}
            </div>
          )
        }

        return (
          <a
            key={index}
            href={item.href}
            target={isExternalLink ? '_blank' : undefined}
            rel={isExternalLink ? 'noreferrer' : undefined}
            className="block h-8 w-8 overflow-hidden rounded-full bg-black/10"
          >
            {avatar}
          </a>
        )
      })}
    </div>
  )
}