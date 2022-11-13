import { json, type RequestHandler } from '@sveltejs/kit';

import { hacks } from '../../../data/hacks';

export const GET: RequestHandler = async (event) => {
  return json({
    message: 'ok',
    data: {
      // gartenLogo will provide a special logo for the banner (rare occation, might change)
      gartenLogo: null,
      hacks: hacks.map((hack) => ({
        id: hack.slug,
        name: hack.name,
        banner: {
          original: `https://creatorsgarten.org/images/hacks/original/${hack.slug}.png`,
          compressed: `https://creatorsgarten.org/images/hacks/compressed/${hack.slug}.webp`
        }
      }))
    }
  });
};
