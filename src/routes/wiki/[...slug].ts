import type { RequestHandler } from './__types/[...slug]';
import { getPage } from './_lib';
import type { PageData } from './_lib/types';

export interface PageProps {
  slug: string;
  data: PageData;
}

export const get: RequestHandler<PageProps> = async ({ params }) => {
  const data = await getPage(params.slug);
  if ('redirect' in data) {
    return {
      status: 302,
      headers: {
        location: `/wiki/${data.redirect.newSlug}`
      }
    };
  }
  return {
    body: {
      slug: params.slug,
      data: data
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
