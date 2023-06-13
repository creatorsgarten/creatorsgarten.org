<script lang="ts">
  import Spinner from './spinner.svelte'
  import BackSide from './backSide.svelte'
  import FrontSide from './frontSide.svelte'

  import type { AuthenticatedUser } from '$types/AuthenticatedUser'

  export let user: AuthenticatedUser

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

<div
  class="bg-gradient-to-b from-[#73A790] from-5% to-[#2E6459] w-full md:h-64 aspect-square md:aspect-auto rounded-2xl text-white leading-none border border-neutral-500 relative overflow-hidden"
>
  {#if accessCard === null}
    <FrontSide user={user} on:click={onClick} />
  {:else}
    <BackSide user={user} accessCard={accessCard} />
  {/if}
  <div
    class={`absolute z-50 bg-black/40 top-0 bottom-0 right-0 left-0 transition duration-300 flex justify-center items-center pointer-events-none ${
      loading ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <Spinner />
  </div>
</div>
