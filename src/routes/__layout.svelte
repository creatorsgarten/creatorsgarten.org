<script>
  import { onMount } from 'svelte';

  import '../app.css';
  import Navbar from '../Components/Navbar.svelte';

  onMount(() => {
    if (
      location.hostname === 'creatorsgarten.com' ||
      location.hostname === 'www.creatorsgarten.com'
    ) {
      location.replace(location.href.replace('.com', '.org'));
    }
    const flags = (new URLSearchParams(location.search).get('flags') || '').split(',');
    document.body.dataset.flags = flags.join(' ');
  });
</script>

<Navbar />

<slot />

<footer class="flex justify-center py-4 text-sm sm:text-lg">
  © 2022 | Made with ♥ by Creatorsgarten
</footer>
