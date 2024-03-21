// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { getIdeas, type Idea } from "./store";

export const load = async ({ params }: Parameters<PageServerLoad<{ ideas: Idea[] }>>[0]) => {
  return {
    ideas: await getIdeas()
  };
};
