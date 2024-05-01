<script lang="ts">
const uwu = typeof window !== 'undefined' && new URL(window.location.href).searchParams.get('uwu') === 'true';
</script>

{#if uwu}
    <img
      src="/images/uwugarten.png"
      alt=""
      loading="lazy"
      class="h-16 lg:h-24 shrink-0"
    />
{:else}
  <img
    src="/images/creatorsgarten.svg"
    alt=""
    loading="lazy"
    class="h-8 lg:h-12 shrink-0"
    style="filter: invert(1);"
  />
{/if}
