import type { PageServerLoad } from "./$types";
import { getIdeas, type Idea } from "../store";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad<{ idea: Idea }> = async ({ params }) => {
  const ideas = await getIdeas()
  const idea = ideas.find(i => i.number === Number(params.number))
  if (!idea) {
    throw error(404, "Not found")
  }
  return { idea };
};
