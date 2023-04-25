interface MarkdownResponse {
  result: {
    data: {
      status: 200
      pageRef: string
      title: string
      file: {
        path: string
        content: string
        revision: string
      }
      frontMatter: unknown
      lastModified: string // ISO timestamp
      lastModifiedBy: string[]
    }
  }
}

export const getMarkdownFromSlug = async (
  slug: string
): Promise<MarkdownResponse> =>
  fetch(
    `https://wiki.creatorsgarten.org/api/contentsgarten/view?${new URLSearchParams(
      {
        input: JSON.stringify({
          pageRef: slug,
          withFile: true,
          revalidate: true,
        }),
      }
    ).toString()}`
  ).then(o => o.json())
