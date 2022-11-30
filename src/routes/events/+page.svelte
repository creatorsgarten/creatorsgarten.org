<script>
  import { hacks } from '../../data/hacks.js';
</script>

<svelte:head>
  <title>Events | Creatorsgarten</title>
</svelte:head>

<div class="cg-container">
  <div class="prose max-w-none">
    <h1 class="mt-16">Past Events</h1>
    <h2 class="mb-12">
      Through workshops, meetups, hackathons, and much more, we bring people together to work on new
      ideas, trying new things and working together across disciplines.
    </h2>
  </div>
  <section class="not-prose grid grid-cols-2 gap-2 md:grid-cols-3">
    {#each [...hacks].reverse() as hack}
      <a href={hack.slug.includes('https://') ? hack.slug : '/wiki/Hacks/' + hack.slug}>
        <div
          class="aspect-square w-full border-2 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all"
        >
          <img src={'images/hacks/compressed/' + hack.slug + '.webp'} class="" alt="" />
        </div>
      </a>
    {/each}
  </section>
</div>

<style>
  h1 {
    @apply text-3xl lg:text-4xl leading-tight;
    font-family: 'Playfair Display', 'Inter', 'Anuphan', system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto;
  }
</style>
