<script>
  import { groups, creators } from '../../data/ring';
</script>

<svelte:head>
  <title>Ring | Creatorsgarten</title>
</svelte:head>

<div class="cg-container min-h-[80vh]">
  <div class="prose max-w-none">
    <h1 class="mt-16">Webring</h1>
    <h2>
      As a collective with many different initiatives, each with their own uniqueness, there has
      been separate websites dedicated to each. The Creatorsgarten Webring serves to bring all our
      initiatives together under the same umbrella. It also serves to connect our members’ personal
      websites.
    </h2>
    <p class="not-prose">
      <a href="/wiki/About/Ring" class="cg-btn">Learn More</a>
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
  </div>
</div>

<style>
  .ring-list a {
    @apply px-2 py-[0.3rem] rounded-md bg-sky-50 hover:bg-sky-100;
  }

  h1 {
    @apply text-3xl lg:text-4xl leading-tight;
    font-family: 'Playfair Display', 'Inter', 'Anuphan', system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto;
  }
</style>
