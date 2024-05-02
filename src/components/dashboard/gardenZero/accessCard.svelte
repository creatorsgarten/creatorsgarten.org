<script lang="ts">
  import Spinner from './spinner.svelte'
  import BackSide from './backSide.svelte'
  import FrontSide from './frontSide.svelte'

  import type { AuthenticatedUser } from '$types/AuthenticatedUser'

  export let user: AuthenticatedUser | null

  interface AccessCard {
    accessKey: string
    expiresAt: Date
  }

  let loading = false
  let accessCard: AccessCard | null = null
  // let accessCard: AccessCard | null = { accessKey: 'grtn-lSLHAm3SfP63Lns', expiresAt: new Date(new Date().valueOf() + (1000*60*5)) }

  const onClick = async () => {
    loading = true

    try {
      const cardResponse = await fetch('/api/gardenGate/access').then(o => {
        if (o.ok) return o.json()
        else throw o
      })

      accessCard = {
        accessKey: cardResponse.accessKey,
        expiresAt: new Date(cardResponse.expiresAt),
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading = false
    }
  }
</script>

{#if user !== null}
  <div
    class="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-500 bg-gradient-to-b from-[#73A790] from-5% to-[#2E6459] leading-none text-white md:aspect-auto md:h-64"
  >
    {#if accessCard === null}
      <FrontSide {user} on:click={onClick} />
    {:else}
      <BackSide {user} {accessCard} />
    {/if}
    <div
      class={`pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/40 transition duration-300 ${
        loading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Spinner />
    </div>
  </div>
{/if}
