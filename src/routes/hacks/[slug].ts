import type { RequestHandler } from './__types/[slug]';

// Redirect to wiki. Remove this file to bring back the original page.
export const get: RequestHandler = async ({ params }) => {
  return {
    status: 302,
    headers: {
      Location: '/wiki/Hacks/' + params.slug
    }
  };
};
