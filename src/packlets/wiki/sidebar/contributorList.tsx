import { ofetch } from 'ofetch'

import { QueryClientContextProvider } from '$constants/queryClient'
import { useQuery } from '@tanstack/react-query'

export interface WikiContributorList {
  pageRef: string
}

export default function WikiContributorList(props: WikiContributorList) {
  return (
    <QueryClientContextProvider>
      <WikiContributorListImpl {...props} />
    </QueryClientContextProvider>
  )
}

function WikiContributorListImpl(props: WikiContributorList) {
  const query = useQuery({
    queryKey: ['wikiContributors', props.pageRef],
    queryFn: async () => {
      const params = new URLSearchParams({
        pageRef: props.pageRef,
      })
      return ofetch<{
        result: {
          data: {
            contributors: {
              login: string
              avatarUrl: string
            }[]
          }
        }
      }>(`/api/wiki/contributors?${params}`)
    },
    retry: false,
  })
  return (
    <div className="flex gap-2">
      {query.data?.result?.data?.contributors.map(contributor => (
        <a
          key={contributor.login}
          href={`https://github.com/${contributor.login}`}
          target="_blank"
          rel="noreferrer"
          className="block h-8 w-8 overflow-hidden rounded-full bg-black/10"
        >
          <img
            src={contributor.avatarUrl}
            alt={contributor.login}
            className="h-8 w-8 rounded-full"
          />
        </a>
      ))}
    </div>
  )
}
