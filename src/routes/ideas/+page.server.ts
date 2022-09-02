import type { PageServerLoad } from ".svelte-kit/types/src/routes/wiki/[...slug]/$types";
import { getIdeas } from "./store";

export interface PageProps {
  ideas: any[]
}

export const load: PageServerLoad<PageProps> = async ({ params }) => {
  return {
    ideas: await getIdeas()
  };
};
