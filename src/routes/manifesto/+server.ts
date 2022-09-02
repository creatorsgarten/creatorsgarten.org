import type { RequestHandler } from '@sveltejs/kit';

// Redirect to wiki. Remove this file to bring back the original page.
export const GET: RequestHandler = async () => {
  return {
    status: 302,
    headers: {
      Location: '/wiki/Manifesto'
    }
  };
};
