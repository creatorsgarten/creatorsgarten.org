import { getContentsgarten } from '../getContentsgarten'
import { purgeFileSystem } from '../fileSystem'
import type { AstroGlobal } from 'astro'

export const updateWiki = async (
  pageRef: string,
  content: string,
  oldRevision: string | undefined,
  Astro: AstroGlobal
) => {
  try {
    const wiki = getContentsgarten(Astro)
    await wiki.save.mutate({
      pageRef,
      newContent: content,
      oldRevision,
    })

    await purgeFileSystem(['wiki', pageRef])
  } catch (e) {
    console.error(e)
    throw new Error('unable-to-edit')
  }
}
