<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { AuthenticatedUser } from '$types/AuthenticatedUser'

  export let user: AuthenticatedUser

  const dispatcher = createEventDispatcher()
</script>

<button
  class="absolute inset-6 flex h-auto w-auto flex-col justify-between text-left"
  on:click={() => dispatcher('click')}
>
  <div class="w-full text-2xl">
    <p class="font-medium">GARDEN ZERO</p>
    <p class="-mt-2">access card</p>
    <img src="/images/g0-org.png" class="mt-2 h-6 w-auto" alt="" />
  </div>
  <div class="w-full">
    <div class="mb-3 text-2xl uppercase md:mt-10">
      <div class="md:flex">
        <h1 class="font-medium">{user.name.split(' ')[0]}</h1>
        <h2 class="-mt-1 mb-2 truncate md:my-0 md:ml-3">
          {user.name.split(' ').slice(1).join(' ')}
        </h2>
      </div>
      <div class="h-[0.1rem] w-6 bg-white md:mt-1" />
    </div>
    <div class="flex items-center justify-between text-base">
      <p>{user.uid}</p>
      <p class="text-base font-medium">GENERATE QR →</p>
    </div>
  </div>
</button>
