import type { PageServerLoad } from "./$types";
import { getIdeas, type Idea } from "./store";

export const load: PageServerLoad<{ ideas: Idea[] }> = async ({ params }) => {
  return {
    ideas: await getIdeas()
  };
};
