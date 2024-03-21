// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getPage } from '../_lib';
import type { PageData } from '../_lib/types';
import { redirect } from '@sveltejs/kit';

export interface PageProps {
  slug: string;
  data: PageData;
}

export const load = async ({ params }: Parameters<PageServerLoad<PageProps>>[0]) => {
  const data = await getPage(params.slug);
  if ('redirect' in data) {
    throw redirect(302, `/wiki/${data.redirect.newSlug}`);
  }
  return {
    slug: params.slug,
    data: data
  };
};
