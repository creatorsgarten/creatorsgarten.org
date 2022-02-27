<script lang="ts">
	const Rings = [
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
	<section>
		<h1 class="text-2xl font-bold">Hacker House</h1>
	</section>

	<section>
		<a href="/">Manifesto</a>
		<span>|</span>
		<a href="/hacks">Hacks</a>
		<span>|</span>
		<a class="underline" href="#!">Webring</a>
	</section>

	<section>
		{#each Hacks as hack}
			<section class="text-gray-800 max-w-2xl">
				<h3 class="font-bold">{hack.theme}</h3>
				<p>{hack.description}</p>
			</section>
		{/each}
	</section>
</main>
