<script lang="ts">
	import { processMarkdown } from '../../markdown';
	import type { PageData } from './_lib';

	export let slug: string;
	export let data: PageData;

	$: output = processMarkdown({
		content: data.content
	});
</script>

slug: {JSON.stringify(slug)}

{@html output.html}
