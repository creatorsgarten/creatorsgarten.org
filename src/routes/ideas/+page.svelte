<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Event Ideas | Creatorsgarten</title>
</svelte:head>

<div class="cg-container min-h-[80vh]">
  <div class="prose max-w-none">
    <h2 class="text-3xl md:text-4xl font-semibold mt-16">Event Ideas</h2>
    <div class="lead">
      <p>
        These board shows the ideas for <strong>events that we would like to see happen.</strong>
      </p>
    </div>
    {#each data.ideas as idea}
      <div class="flex">
        <div class="flex-none" />
        <div class="flex-auto">
          <h3 class="text-xl font-semibold">
            <a href="/ideas/{idea.number}">{idea.title}</a>
          </h3>
          <p>{idea.excerpt}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
