import type { RequestHandler } from './__types/[...slug]';
import { getPage, type PageData } from './_lib';

export interface PageProps {
  slug: string;
  data: PageData;
}

export const get: RequestHandler<PageProps> = async ({ params }) => {
  return {
    body: {
      slug: params.slug,
      data: await getPage(params.slug)
    }
  };
};

export const post: RequestHandler<PageProps> = async ({ params, request }) => {
  const data = await request.formData();
  return {
    body: {
      slug: params.slug,
      data: {
        content: String(data.get('content') || ''),
        mode: 'preview'
      }
    }
  };
};
