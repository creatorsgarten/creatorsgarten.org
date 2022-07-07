<script lang="ts">
  import { processMarkdown } from '../../markdown';
  import type { PageData } from './_lib';

  export let slug: string;
  export let data: PageData;

  $: output = processMarkdown({
    content: data.content
  });
</script>

<div class="cg-container">
  slug: {JSON.stringify(slug)}
  <article class="prose prose-lg max-w-none">
    {@html output.html}
  </article>
</div>
