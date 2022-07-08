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

<div class="cg-container">
  <footer
    class="flex justify-center mt-8 py-6 text-sm sm:text-lg border-t border-gray-600 text-gray-600"
  >
    © 2022 | Made with ♥ by Creatorsgarten
  </footer>
</div>
