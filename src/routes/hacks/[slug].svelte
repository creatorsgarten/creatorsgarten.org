<script context="module">
  /** @type {import('./[slug]').Load} */
  export async function load({ params, fetch, session, stuff }) {
    const res = await fetch(`/hacks/${params.slug}.md`);
    if (res.ok) {
      return {
        props: {
          body: await res.text()
        }
      };
    }
    return {
      status: res.status,
      error: new Error()
    };
  }
</script>

<script lang="ts">
  import MarkdownIt from 'markdown-it';
  import mim from 'markdown-it-meta';
  import mihs from 'markdown-it-header-sections';
  import mila from 'markdown-it-link-attributes';

  import { page } from '$app/stores';

  export let body: string;

  let result: string;

  const headerParser = (match: string, title: string) => {
    return `<div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-gray-600"></div>
        <span class="flex-shrink text-xl mx-4 text-gray-600">${title}</span>
        <div class="flex-grow border-t border-gray-600"></div>
    </div>`;
  };

  const md = new MarkdownIt().use(mim).use(mihs).use(mila);
  result = md.render(body).replace(/<h1>(.*)<\/h1>/g, headerParser);
  const meta = md.meta;

  const slug = $page.params.slug;
</script>

<div>
  <section class="flex flex-col w-full md:mb-4 md:flex-row">
    <img
      src={'/images/hacks/compressed/' + slug + '.webp'}
      class="mr-10 aspect-square w-full border-2 border-black md:w-5/12"
      alt=""
    />
    <div class="mt-6 flex w-full flex-col justify-center md:mt-0">
      <h1 class="pb-2 text-2xl font-medium md:w-11/12 md:text-4xl lg:text-3xl">{meta.name}</h1>
      <h3 class="text-lg">{meta.location}</h3>
      <h3 class="text-lg">{meta.date}</h3>
      <h3 class="text-lg">Website: <a href={meta.site}>{meta.site}</a></h3>
      <h3 class="text-lg">
        By:
        {#each meta.by as team}
          <span class="pr-1">[{team}]</span>
        {/each}
      </h3>
    </div>
  </section>

  {@html result}

  <section>
    <div class="relative flex py-5 items-center">
      <div class="flex-grow border-t border-gray-600" />
    </div>
  </section>
</div>

<style>
  div :global(p) {
    @apply pb-2;
  }

  div :global(ul) {
    @apply list-disc list-inside text-lg;
  }
</style>
