import { ofetch } from 'ofetch'

import { QueryClientContextProvider } from '$constants/queryClient'
import { useQuery } from '@tanstack/react-query'
import { AvatarGrid } from '$components/avatarGrid'

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
  
  const avatarItems = query.data?.result?.data?.contributors.map(contributor => ({
    href: `https://github.com/${contributor.login}`,
    imageUrl: contributor.avatarUrl,
    imageAlt: contributor.login,
  })) || []
  
  return <AvatarGrid items={avatarItems} />
}
