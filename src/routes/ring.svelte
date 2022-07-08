<script>
  import { groups, creators } from '../data/ring';
</script>

<svelte:head>
  <title>Ring | Creatorsgarten</title>
</svelte:head>

<div class="cg-container min-h-[80vh]">
  <div class="prose max-w-none prose-a:no-underline prose-a:text-sky-600">
    <h2>Us & Our Friends</h2>
    <ul>
      {#each groups as group}
        <li><a href={group.link}>{group.name}</a></li>
      {/each}
    </ul>

    <h2>Creators Ring</h2>
    <ul>
      {#each creators as creator}
        <li><a href={creator.link}>{creator.name}</a></li>
      {/each}
    </ul>
  </div>
</div>

<style>
  section {
    @apply pb-4;
  }
  h1 {
    @apply text-3xl pb-2;
  }
  ul {
    @apply grid grid-cols-1 list-disc list-inside;
  }
  li {
    @apply my-[0.4rem];
  }
  a {
    @apply px-2 py-[0.3rem] rounded-md bg-sky-50 hover:bg-sky-100;
  }
</style>
