import '@docsearch/css'
import { DocSearch } from '@docsearch/react'

interface DocSearchProps {
  isMobile?: boolean
}

export function DocSearchComponent({ isMobile = false }: DocSearchProps) {
  return (
    <DocSearch
      appId="V0Z2KP6GX5"
      indexName="Creatorsgarten"
      apiKey="554b5c4e4c64dfb498503b1ad028ad4e"
      placeholder={isMobile ? 'Search...' : 'Search docs...'}
    />
  )
}
