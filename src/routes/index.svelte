<script>
  import { hacks } from '../data/hacks.js';
</script>

<svelte:head>
  <title>Creatorsgarten</title>
</svelte:head>

<div class="cg-container">
  <section>
    <img src="images/cover.webp" class="border-2 border-black" alt="" />
  </section>

  <div class="prose prose-lg max-w-none mt-8">
    <h2>Who are we?</h2>
    <div class="lg:w-11/12">
      <p>
        We are a diverse group of people who are united by our love for creating things. We believe
        that through the lens of creation and technology, we can discover the fun and beauty in
        everything around us. We stand for:
      </p>
      <p>
        <strong>Creativity</strong>: We believe that creativity is a fundamental human quality that
        should be nurtured and encouraged. We believe that everyone has the potential to be
        creative, and that the world is a better place when we all express our creativity.
      </p>
      <p>
        <strong>Empathy</strong>: We believe in putting ourselves in others' shoes, and using our
        skills to make a positive impact on the world.
      </p>
      <p>
        <strong>Fun</strong>: We believe that work should be enjoyable, and that every day is an
        opportunity to learn something new and have some fun.
      </p>
      <p class="not-prose">
        <button class=" rounded-md border-2 border-black px-2 py-1 hover:bg-gray-200"
          ><a href="/manifesto" class="text-black hover:text-black">Manifesto</a></button
        >
      </p>
    </div>

    <h2>Hacks</h2>
    <section class="not-prose grid grid-cols-2 gap-2 pb-6 md:grid-cols-3 lg:gap-4">
      {#each [...hacks].reverse() as hack}
        <a href={hack.slug.includes('https://') ? hack.slug : 'hacks/' + hack.slug}>
          <div
            class="aspect-square w-full border-2 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all"
          >
            <img src={'images/hacks/compressed/' + hack.slug + '.webp'} class="" alt="" />
          </div>
        </a>
      {/each}
    </section>
  </div>
</div>
