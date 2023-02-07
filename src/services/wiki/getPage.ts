import { getIndexes } from "./getIndexes";
import { getStorage } from "./getStorage";

import type { PageData } from '$types/PageData'

export const getPage = async (slug: string): Promise<PageData> => {
  if (slug === 'Special/AllPages') {
    const indexes = await getIndexes();
    const pages = indexes.pages;
    return {
      content:
        'All pages!\n\n' +
        Object.keys(pages)
          .sort()
          .map((k) => {
            const page = pages[k];
            const name = page?.name;
            const append = name ? ` (${name})` : '';
            return `- [${k}](/wiki/${k})${append}`;
          })
          .join('\n'),
      mode: 'generated'
    };
  }

  const path = `wiki/${slug}.md`;
  const page = await getStorage().readFile(path);
  // if (!page) {
  //   const index = await getIndexes();
  //   const pages = index.pages;
  //   const foundSlug = Object.keys(pages).find((k) => k.toLowerCase() === slug.toLowerCase());
  //   if (foundSlug && slug !== foundSlug) {
  //     return {
  //       redirect: { newSlug: foundSlug }
  //     };
  //   }
  // }
  return {
    content: page?.content || null,
    sha: page?.sha,
    mode: 'local'
  };
}
