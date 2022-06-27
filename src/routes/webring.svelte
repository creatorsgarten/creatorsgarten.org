<script lang="ts">
	const hacks = [
		{
			theme: 'Music',
			description:
				'It is concerned with properties of space that are related with distance, shape, size, and relative position of figures.',
			url: ''
		},
		{
			theme: 'Music',
			description:
				'It is concerned with properties of space that are related with distance, shape, size, and relative position of figures.',
			url: ''
		},
		{
			theme: 'Music',
			description:
				'It is concerned with properties of space that are related with distance, shape, size, and relative position of figures.',
			url: ''
		}
	]
</script>

<main class="px-8 py-5 space-y-4">
	<section class="space-y-2">
		{#each hacks as hack}
			<section class="text-gray-800 max-w-2xl">
				<h3 class="font-bold">{hack.theme}</h3>
				<p>{hack.description}</p>
			</section>
		{/each}
	</section>
</main>
