<script lang="ts">
  import type { PageData } from './$types';
  import Subscribe from './Subscribe.svelte';
  export let data: PageData;
</script>

<svelte:head>
  <title>Event Idea: {data.idea.title} | Creatorsgarten</title>
</svelte:head>

<div class="cg-container min-h-[80vh]">
  <div class="prose mb-6 max-w-none">
    <div class="mt-14">
      <a href="/ideas" class="text-blue-500 hover:text-blue-600">← Back to Event Ideas</a>
    </div>
    <h2 class="mt-2 text-3xl font-semibold md:text-4xl">{data.idea.title}</h2>
    {@html data.idea.bodyHTML}
    <p class="not-prose">
      <a href={data.idea.url} class="cg-btn">Discuss on GitHub</a>
    </p>
  </div>
  <Subscribe />
</div>
