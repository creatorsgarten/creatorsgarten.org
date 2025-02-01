import { Icon } from 'react-iconify-icon-wrapper'

import { QueryClientContextProvider } from '$constants/queryClient'
import { useQuery } from '@tanstack/react-query'

export interface WikiUpdateChecker {
  pageRef: string
  initialContentHash: string
}

export default function WikiUpdateChecker(props: WikiUpdateChecker) {
  return (
    <QueryClientContextProvider>
      <WikiUpdateCheckerImpl {...props} />
    </QueryClientContextProvider>
  )
}

function WikiUpdateCheckerImpl(props: WikiUpdateChecker) {
  const query = useQuery({
    queryKey: ['wiki', props.pageRef],
    queryFn: async () => {
      const params = new URLSearchParams({
        pageRef: props.pageRef,
        hash: props.initialContentHash,
      })
      const response = await fetch(`/api/wiki/checkUpdates?${params}`)
      return await response.json()
    },
    retry: false,
  })
  const latestHash = query.data?.result?.data?.latestHash
  return latestHash && latestHash !== props.initialContentHash ? (
    <UpdatesAvailable />
  ) : null
}

function UpdatesAvailable() {
  return (
    <button
      className="absolute right-3 top-3 rounded-sm px-2 py-1 text-neutral-500 hover:border-neutral-400"
      onClick={() => location.reload()}
    >
      <Icon icon="eva:refresh-outline" inline />
      <span className="hidden md:inline"> New content available</span>
    </button>
  )
}
