// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { getIdeas, type Idea } from "../store";
import { error } from "@sveltejs/kit";

export const load = async ({ params }: Parameters<PageServerLoad<{ idea: Idea }>>[0]) => {
  const ideas = await getIdeas()
  const idea = ideas.find(i => i.number === Number(params.number))
  if (!idea) {
    throw error(404, "Not found")
  }
  return { idea };
};
