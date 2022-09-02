import type { PageServerLoad, Action } from '../$types';
import { getPage } from '../_lib';
import type { PageData } from '../_lib/types';

export interface PageProps {
  slug: string;
  data: PageData;
}

export const load: PageServerLoad<PageProps> = async ({ params }) => {
  const data = await getPage(params.slug);
  if ('redirect' in data) {
    throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
    return {
      status: 302,
      headers: {
        location: `/wiki/${data.redirect.newSlug}`
      }
    };
  }
  return {
  slug: params.slug,
  data: data
};
};

export const POST: Action<PageProps> = async ({ params, request }) => {
  const data = await request.formData();
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
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
