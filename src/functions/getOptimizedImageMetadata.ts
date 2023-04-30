import type { OptimizedImageOption } from '$types/OptimizedImageOption'
import { getOptimizedImageUrl } from './getOptimizedImageUrl'

interface Metadata {
  width: number
  height: number
  original: {
    file_size: number
    width: number
    height: number
    format: string
  }
}

export const getOptimizedImageMetadata = async (
  url: string,
  options: OptimizedImageOption = {}
) =>
  fetch(
    getOptimizedImageUrl(url, {
      ...options,
      format: 'json',
    })
  ).then(o => (o.ok ? (o.json() as Promise<Metadata>) : null))
