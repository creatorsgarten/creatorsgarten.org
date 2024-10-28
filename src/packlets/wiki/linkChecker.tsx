import { QueryClientContextProvider } from '$constants/queryClient'
import DataLoader from 'dataloader'
import { useEffect } from 'react'

export interface WikiLinkChecker {}

export default function WikiLinkChecker(props: WikiLinkChecker) {
  return (
    <QueryClientContextProvider>
      <WikiLinkCheckerImpl {...props} />
    </QueryClientContextProvider>
  )
}

function WikiLinkCheckerImpl(props: WikiLinkChecker) {
  useEffect(() => {
    const loader = new DataLoader(async (pageRefs: readonly string[]) => {
      const response = await fetch(
        `/api/wiki/checkExists?pageRefs=${pageRefs.join(',')}`
      )
      const data = await response.json()
      const found = new Set(data.result)
      return pageRefs.map(pageRef => found.has(pageRef))
    })
    const internalLinks = document.querySelectorAll<HTMLAnchorElement>(
      'a.internal[href^="/wiki/"]'
    )
    const checkLink = async (link: HTMLAnchorElement) => {
      const pageRef = new URL(link.href).pathname.replace('/wiki/', '')
      const exists = await loader.load(pageRef)
      link.dataset.exists = String(exists)
    }
    for (const link of internalLinks) {
      checkLink(link)
    }
  }, [])
  return null
}
