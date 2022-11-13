import { json, type RequestHandler } from '@sveltejs/kit';

import { latest, upcoming } from '../../../data';

export const GET: RequestHandler = async (event) => {
  return json({
    message: 'ok',
    data: {
      // gartenLogo will provide a special logo for the banner (rare occation, might change)
      gartenLogo: null,
      hacks: [...latest, ...upcoming].reverse().map((hack) => ({
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
