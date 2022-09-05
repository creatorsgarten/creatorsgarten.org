<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Event Ideas | Creatorsgarten</title>
</svelte:head>

<div class="cg-container min-h-[80vh]">
  <div class="prose max-w-none">
    <h2 class="mt-16 text-3xl font-semibold md:text-4xl">Event Ideas Board</h2>
    <div class="lead">
      <p>
        This board shows the <strong>events that we’d like to see someday</strong> but don’t know when
        yet.
      </p>
    </div>
    <p>
      If you find any idea below interesting, you can subscribe for updates to that idea. This will
      signal your interest to us, and we will also notify you by email when an event based on that
      idea is scheduled.
    </p>
    <p class="not-prose">
      <a href="/wiki/About/EventIdeas" class="cg-btn">Learn More</a>
    </p>
    <hr />
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
