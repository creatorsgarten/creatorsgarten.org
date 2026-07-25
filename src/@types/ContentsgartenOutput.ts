import type { contentsgarten } from '$constants/contentsgarten'

type Client = ReturnType<typeof contentsgarten>

export interface ContentsgartenOutput {
  search: Awaited<ReturnType<Client['search']['query']>>
  view: Awaited<ReturnType<Client['view']['query']>>
  getContributors: Awaited<ReturnType<Client['getContributors']['query']>>
  getEditPermission: Awaited<ReturnType<Client['getEditPermission']['query']>>
  save: Awaited<ReturnType<Client['save']['mutate']>>
}
