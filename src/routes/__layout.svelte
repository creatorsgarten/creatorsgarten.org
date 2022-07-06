<script>
	import { onMount } from 'svelte';

	import '../app.css';
	import Navbar from '../Components/Navbar.svelte';

	onMount(() => {
		if (location.hostname === 'creatorsgarten.com') {
			location.replace(location.href.replace('.com', '.org'));
		}
	});
</script>

<Navbar />

<slot />

<footer class="flex justify-center py-3 mt-4 bg-gray-100 text-lg">
	© 2022 | Made with ♥ by Creatorsgarten
</footer>
