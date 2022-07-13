<script>
  import { groups, creators } from '../data/ring';
</script>

<svelte:head>
  <title>Ring | Creatorsgarten</title>
</svelte:head>

<div class="cg-container min-h-[80vh]">
  <div class="prose prose-lg max-w-none">
    <h2>Webring</h2>
    <p>
      As a collective with many different initiatives, each with their own uniqueness, there has
      been separate websites dedicated to each. The Creatorsgarten Webring serves to bring all our
      initiatives together under the same umbrella. It also serves to connect our members’ personal
      websites.
    </p>
    <h2>Us & Our Friends</h2>
    <ul class="ring-list">
      {#each groups as group}
        <li><a href={group.link}>{group.name}</a></li>
      {/each}
    </ul>

    <h2>Creators Ring</h2>
    <ul class="ring-list">
      {#each creators as creator}
        <li><a href={creator.link}>{creator.name}</a></li>
      {/each}
    </ul>

    <p class="not-prose mt-8">
      <a href="/wiki/About/Ring" class="cg-btn">About</a>
    </p>
  </div>
</div>

<style>
  .ring-list a {
    @apply px-2 py-[0.3rem] rounded-md bg-sky-50 hover:bg-sky-100;
  }
</style>
