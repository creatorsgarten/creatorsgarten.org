import ExpiryMap from "expiry-map";
import pMemoize from "p-memoize";

export const getIdeas = pMemoize(async () => {
  const r = await fetch('https://creatorsgarten.lovely.workers.dev/ideas');
  const { data } = await r.json();
  return data.repository.discussions.nodes.map((n: any) => {
    return {
      ...n,
      excerpt: n.bodyText.trim().split(/\n/)[0],
    };
  }) as Idea[];
}, {
  cache: new ExpiryMap(60000)
})

export interface Idea {
  number: number
  excerpt: string
  title: string
  bodyHTML: string
  bodyText: string
  url: string
}