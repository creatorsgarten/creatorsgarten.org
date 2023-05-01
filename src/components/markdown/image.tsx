import { getOptimizedImageUrl } from '$functions/getOptimizedImageUrl'

import type { ImgHTMLAttributes } from 'react'

export const MarkdownImage = (
  props: ImgHTMLAttributes<HTMLImageElement>
) => {
  const builtSrc = props.src ?? ''

  if (import.meta.env.PROD)
    return (
      <picture>
        <source
          srcSet={getOptimizedImageUrl(builtSrc, {
            format: 'webp',
            quality: 85,
          })}
          type="image/webp"
        />
        <img
          {...props}
          src={getOptimizedImageUrl(builtSrc, {
            quality: 85,
          })}
          loading="lazy"
        />
      </picture>
    )
  else return <img {...props} loading="lazy" />
}
