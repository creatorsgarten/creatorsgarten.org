<script lang="ts">
  import Spinner from './spinner.svelte'

  import type { AuthenticatedUser } from '$types/AuthenticatedUser'

  export let user: AuthenticatedUser

  interface AccessCard {
    accessKey: string
    expiresAt: Date
  }

  let loading = false
  let accessCard: AccessCard | null = null

  const onClick = async () => {
    loading = true

    try {
      const cardResponse = await fetch('/api/g0').then(o => {
        if (o.ok) return o.json()
        else throw o
      })

      console.log(cardResponse)

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
    <button
      class="flex flex-col justify-between text-left absolute inset-6 w-auto h-auto"
      on:click={onClick}
    >
      <div class="text-2xl w-full">
        <h1 class="font-medium">GARDEN ZERO</h1>
        <h1 class="-mt-2">access card</h1>
        <img src="/images/g0-org.png" class="h-6 w-auto mt-2" alt="" />
      </div>
      <div class="w-full">
        <div class="text-2xl mb-3 uppercase md:mt-10">
          <div class="md:flex">
            <h1 class="font-medium">{user.name.split(' ')[0]}</h1>
            <h1 class="-mt-1 mb-2 md:my-0 md:ml-3 truncate">
              {user.name.split(' ').slice(1).join(' ')}
            </h1>
          </div>
          <div class="w-6 h-[0.1rem] bg-white md:mt-1" />
        </div>
        <div class="flex justify-between items-center text-base">
          <h1>{user.uid}</h1>
          <h1 class="font-medium text-base">GENERATE QR →</h1>
        </div>
      </div>
    </button>
  {:else}
    <div class="absolute inset-4">
      <img
        alt=""
        class="h-full w-auto rounded-2xl"
        src={`/api/qr?${new URLSearchParams({
          value: accessCard.accessKey,
        })}`}
      />
    </div>
  {/if}
  <div
    class={`absolute z-50 bg-black/40 top-0 bottom-0 right-0 left-0 transition duration-300 flex justify-center items-center pointer-events-none ${
      loading ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <Spinner />
  </div>
</div>
