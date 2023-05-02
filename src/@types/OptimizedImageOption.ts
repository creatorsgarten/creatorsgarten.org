// https://developers.cloudflare.com/images/image-resizing/url-format/#options
export interface OptimizedImageOption {
  anim?: boolean
  background?: string
  blur?: number
  brightness?: number
  compression?: 'fast' // faster compression = larger file size
  contrast?: number
  dpr?: number
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
  format?: 'webp' | 'avif' | 'json'
  gamma?: number
  width?: number
  height?: number
  metadata?: 'keep' | 'copyright' | 'none'
  quality?: number
  rotate?: number
  sharpen?: number
}
