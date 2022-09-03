<script lang="ts">
  import type { PageData } from './$types';
  import Subscribe from './Subscribe.svelte';
  export let data: PageData;

  function splitParts(html: string) {
    // Find the index of first H1, H2, H3, or HR element.
    const index = html.search(/<h[123]|<hr/i);
    if (index === -1) {
      return [html, ''];
    }
    return [html.slice(0, index), html.slice(index)];
  }

  $: parts = splitParts(data.idea.bodyHTML);
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
    {@html parts[0]}
  </div>
  <Subscribe listId="idea-{data.idea.number}" />
  <div class="prose mt-[3em] max-w-none">
    {#if parts[1]}
      <hr />
    {/if}
    {@html parts[1]}
    <hr />
    <ul>
      <li>
        <a href={data.idea.url}>Discuss this idea on GitHub Discussions</a>
      </li>
    </ul>
  </div>
</div>
