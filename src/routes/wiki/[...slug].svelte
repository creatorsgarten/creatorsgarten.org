<script lang="ts">
  import { processMarkdown } from '../../markdown';
  import type { PageData } from './_lib/types';
  import { authState } from './_lib/auth';
  import PageEditor from './_lib/PageEditor.svelte';
  import { getLayout } from './_lib/layout';

  let editing = false;
  export let slug: string;
  export let data: PageData;

  $: output = processMarkdown({
    content: data.content || 'This page doesn’t exist.'
  });

  $: meta = output.meta;
  $: layout = getLayout(meta.layout || 'default');
</script>

<svelte:head>
  <title>{meta.name || slug} | Creatorsgarten Wiki</title>
</svelte:head>

<div class="cg-container">
  <h1
    class={layout.headerStyle === 'large'
      ? 'text-3xl md:text-4xl font-bold mt-16'
      : 'opacity-50 mt-4'}
  >
    {slug}
    {#if data.mode !== 'generated'}
      <button
        class="inline-block"
        title="Edit"
        on:click={() => (editing = !editing)}
        class:hidden={$authState === 'checking'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
          <path
            fill-rule="evenodd"
            d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"
          />
        </svg>
      </button>
    {/if}
  </h1>

  <div class:hidden={editing}>
    {#if meta.layout === 'hacks'}
      <section class="flex flex-col w-full md:mb-4 md:flex-row">
        <img
          src={'/images/hacks/compressed/' + slug.split('/').pop() + '.webp'}
          class="mr-10 aspect-square w-full border-2 border-black md:w-5/12"
          alt=""
        />
        <div class="mt-6 flex w-full flex-col justify-center md:mt-0">
          <h1 class="pb-2 text-2xl font-medium md:w-11/12 md:text-4xl lg:text-3xl">{meta.name}</h1>
          <h3 class="text-lg">{meta.location}</h3>
          <h3 class="text-lg">{meta.date}</h3>
          {#if meta.site}
            <h3 class="text-lg truncate">
              Website: <a href={meta.site}>{meta.site}</a>
            </h3>
          {/if}
          <h3 class="text-lg">
            By:
            {#each meta.by as team}
              <span class="pr-1">[{team}]</span>
            {/each}
          </h3>
        </div>
      </section>
    {/if}

    <article class="prose md:prose-lg max-w-none mt-8">
      {@html output.html}
    </article>
  </div>
  {#if data.mode !== 'generated'}
      <div class:hidden={!editing} class="mt-8">
      <PageEditor {editing} {data} {slug} />
    </div>
  {/if}
</div>
