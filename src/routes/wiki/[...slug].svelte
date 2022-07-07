<script lang="ts">
  import { processMarkdown } from '../../markdown';
  import type { PageData } from './_lib';

  let edit = false;
  export let slug: string;
  export let data: PageData;

  $: output = processMarkdown({
    content: data.content
  });
</script>

<div class="cg-container">
  <h1 class="text-3xl font-bold mt-16">{slug}</h1>
  <article class="prose prose-lg max-w-none">
    {@html output.html}
  </article>
</div>
