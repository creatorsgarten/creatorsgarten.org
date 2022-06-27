<script>
	import '../app.css'
	import { page } from '$app/stores'

	const navItems = [
		{ path: '/', title: 'Manifesto' },
		{ path: '/hacks', title: 'Hacks' },
		{ path: '/webring', title: 'Webring' }
	]
</script>

<section class="px-8 pt-5">
	<h1 class="text-2xl font-bold">Creatorsgarten</h1>
</section>

<section class="px-8">
	{#each navItems as item, i}
		{#if i > 0}
			{' '}
			<span>|</span>
			{' '}
		{/if}
		<a href={item.path} class:underline={$page.url.pathname === item.path} sveltekit:prefetch
			>{item.title}</a
		>
	{/each}
</section>

<slot />
