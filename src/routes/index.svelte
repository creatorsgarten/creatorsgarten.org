<script>
  import { hacks } from '../data/hacks.js';
  import { latest, upcoming, projects } from '../data/index';
</script>

<svelte:head>
  <title>Creatorsgarten</title>
</svelte:head>

<div class="flex items-center justify-center lg:mt-6 mb-8 lg:mb-12">
  <section class="max-w-[1440px] py-10 lg:py-20 lg:mx-10 lg:rounded-3xl mesh">
    <div class="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12 xl:px-32">
      <div class="w-11/12 md:w-4/5 xl:w-1/2 mx-4">
        <h1 class="mb-6">We create things to find the beauty and fun in everything around us.</h1>
        <p class="text-lg mb-6">
          Creatorsgarten is a collective of creators who enjoy making things. We unite to create a
          supportive environment for all creators where they can come to create, learn, and share.
        </p>
        <p>
          <a href="/wiki/Manifesto" class="cg-btn">Manifesto</a>
        </p>
      </div>
    </div>
  </section>
</div>

<div class="cg-large-container flex flex-col lg:flex-row prose prose-lg max-w-none mb-16">
  <div class="w-full lg:w-1/2 lg:mr-12 mb-4">
    <div class="mb-10 lg:mb-0 lg:sticky lg:top-6">
      <h1>Events</h1>
      <p class="w-full md:w-3/5 lg:w-5/6 lg:text-lg">
        Through workshops, meetups, hackathons, and much more, we bring people together to work on
        new ideas, trying new things and working together across disciplines.
      </p>
      <p>
        <a href="/events" class="cg-btn">View All</a>
      </p>
    </div>
  </div>

  <div class="w-full">
    <h1 class="text-3xl">Upcoming</h1>
    <section class="not-prose grid grid-cols-2 gap-2 pb-6 md:grid-cols-3 mb-4 lg:mb-6">
      {#each [...upcoming].reverse() as event}
        <a href={event.slug.includes('https://') ? event.slug : '/wiki/Hacks/' + event.slug}>
          <div
            class="aspect-square w-full border-2 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all"
          >
            <img src={'images/hacks/compressed/' + event.slug + '.webp'} class="" alt="" />
          </div>
        </a>
      {/each}
    </section>
    <h1 class="text-3xl">Latest Events</h1>
    <section class="not-prose grid grid-cols-2 gap-2 md:grid-cols-3">
      {#each [...latest].reverse() as event}
        <a href={event.slug.includes('https://') ? event.slug : '/wiki/Hacks/' + event.slug}>
          <div
            class="aspect-square w-full border-2 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all"
          >
            <img src={'images/hacks/compressed/' + event.slug + '.webp'} class="" alt="" />
          </div>
        </a>
      {/each}
    </section>
  </div>
</div>

<div class="flex items-center justify-center mb-10 lg:mb-16">
  <section class="max-w-[1440px] py-10 lg:py-20 lg:mx-10 lg:rounded-3xl mesh-3">
    <div class="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12 xl:px-32">
      <div class="w-11/12 md:w-4/5 xl:w-1/2 mx-4">
        <h1 class="mb-6">Creatorsgarten = Garden of Creators</h1>
        <p class="text-xl mb-6">
          The name Creatorsgarten comes from the word creators and garten, as in kindergarten, which
          means garden of children in German. We chose this name because we want to create a garden
          for all creators where they can come to create, learn, and share.
        </p>
      </div>
    </div>
  </section>
</div>

<div class="cg-large-container flex flex-col lg:flex-row prose prose-lg max-w-none mb-10 lg:mb-16">
  <div class="w-full lg:w-1/2 lg:mr-12">
    <div class="mb-10 lg:mb-0 lg:sticky lg:top-6">
      <h1>Projects</h1>
      <p class="w-full md:w-3/5 lg:w-5/6 lg:text-xl">
        We believe that work should be enjoyable, and that every day is an opportunity to learn
        something new and have some fun.
      </p>
      <p>
        <a href="https://github.com/creatorsgarten" class="cg-btn">Github</a>
      </p>
    </div>
  </div>

  <div class="w-full">
    <section class="not-prose grid grid-cols-1 gap-2 md:grid-cols-3 mb-4">
      {#each [...projects] as project}
        <a href={project.slug.includes('https://') ? project.slug : '/wiki/Hacks/' + project.slug}>
          <div
            class="p-4 aspect-[21/9] lg:aspect-square flex flex-col justify-center items-center w-full border-2 bg-slate-800 border-black hover:scale-[1.003] hover:shadow-sm hover:transition-all rounded-lg"
          >
            <h2 class="text-2xl font-medium mb-2 text-white">{project.name}</h2>
            <p class="text-center text-gray-300">{project.description}</p>
          </div>
        </a>
      {/each}
    </section>
  </div>
</div>

<div
  class="cg-large-container flex flex-col lg:items-center prose prose-lg max-w-none mb-16 bg-gray-100 border-2 py-10"
>
  <h1 class="mb-2">Meet us</h1>
  <p class="w-full md:w-3/5 lg:w-5/6 lg:text-xl lg:text-center">
    As a collective with many initiatives, each with their own uniqueness, there has been separate
    organization dedicated to each. Creatorsgarten serves to bring all our initiatives together.
  </p>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    <a
      href="https://stupidhackth.github.io"
      class=" w-full flex justify-center items-center hover:scale-[1.01]"
    >
      <img class="w-full m-0" src="images/stupidhackth.svg" alt="" />
    </a>
    <a
      href="https://instagram.com/polaryz.club"
      class="w-full flex justify-center items-center hover:scale-[1.001]"
    >
      <img class="w-full m-0" src="images/polaryzclub.svg" alt="" />
    </a>
    <a
      href="https://showdown.space"
      class="w-full flex justify-center items-center hover:scale-[1.001]"
    >
      <img class="w-full m-0" src="images/showdownspace.svg" alt="" />
    </a>
  </div>
</div>

<style>
  .mesh {
    background-color: rgb(21, 94, 117);
    background-image: radial-gradient(at 48% 49%, rgb(254, 252, 232) 0, transparent 89%),
      radial-gradient(at 64% 44%, rgb(254, 242, 242) 0, transparent 18%),
      radial-gradient(at 64% 97%, rgb(28, 25, 23) 0, transparent 40%),
      radial-gradient(at 14% 17%, rgb(224, 242, 254) 0, transparent 82%),
      radial-gradient(at 43% 71%, rgb(244, 63, 94) 0, transparent 66%);
  }
  /* .mesh-2 {
    background-color: rgb(255, 228, 230);
    background-image: radial-gradient(at 66% 47%, rgb(232, 121, 249) 0, transparent 30%),
      radial-gradient(at 69% 59%, rgb(196, 181, 253) 0, transparent 51%),
      radial-gradient(at 56% 48%, rgb(21, 128, 61) 0, transparent 48%),
      radial-gradient(at 100% 32%, rgb(254, 240, 138) 0, transparent 18%),
      radial-gradient(at 31% 89%, rgb(24, 24, 27) 0, transparent 32%),
      radial-gradient(at 29% 63%, rgb(250, 250, 250) 0, transparent 33%);
  } */
  .mesh-3 {
    background-color: rgb(252, 165, 165);
    background-image: radial-gradient(at 79% 79%, rgb(236, 254, 255) 0, transparent 59%),
      radial-gradient(at 22% 84%, rgb(254, 249, 195) 0, transparent 47%),
      radial-gradient(at 55% 48%, rgb(136, 19, 55) 0, transparent 47%),
      radial-gradient(at 81% 52%, rgb(7, 89, 133) 0, transparent 52%),
      radial-gradient(at 19% 2%, rgb(147, 197, 253) 0, transparent 35%);
    /* radial-gradient(at 17% 34%, rgb(5, 150, 105) 0, transparent 6%); */
  }
</style>
