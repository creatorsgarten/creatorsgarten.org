<script>
  import { groups, creators } from '../data/ring';
</script>

<div class="min-h-[80vh]">
  <section>
    <h1>Us & Our Neighbors</h1>
    <ul>
      {#each groups as group}
        <li><a href={group.link}>{group.name}</a></li>
      {/each}
    </ul>
  </section>

  <section>
    <h1>Creators</h1>
    <ul>
      {#each creators as creator}
        <li><a href={creator.link}>{creator.name}</a></li>
      {/each}
    </ul>
  </section>
</div>

<style>
  section {
    @apply pb-4;
  }
  h1 {
    @apply text-3xl pb-2;
  }
  ul {
    @apply grid grid-cols-1 list-disc list-inside;
  }
  li {
    @apply my-[0.4rem];
  }
  a {
    @apply px-2 py-[0.3rem] rounded-md bg-sky-50 hover:bg-sky-100;
  }
</style>
