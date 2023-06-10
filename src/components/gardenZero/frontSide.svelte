<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { AuthenticatedUser } from '$types/AuthenticatedUser'

  export let user: AuthenticatedUser

  const dispatcher = createEventDispatcher()
</script>

<button
  class="flex flex-col justify-between text-left absolute inset-6 w-auto h-auto"
  on:click={() => dispatcher('click')}
>
  <div class="text-2xl w-full">
    <p class="font-medium">GARDEN ZERO</p>
    <p class="-mt-2">access card</p>
    <img src="/images/g0-org.png" class="h-6 w-auto mt-2" alt="" />
  </div>
  <div class="w-full">
    <div class="text-2xl mb-3 uppercase md:mt-10">
      <div class="md:flex">
        <h1 class="font-medium">{user.name.split(' ')[0]}</h1>
        <h2 class="-mt-1 mb-2 md:my-0 md:ml-3 truncate">
          {user.name.split(' ').slice(1).join(' ')}
        </h2>
      </div>
      <div class="w-6 h-[0.1rem] bg-white md:mt-1" />
    </div>
    <div class="flex justify-between items-center text-base">
      <p>{user.uid}</p>
      <p class="font-medium text-base">GENERATE QR →</p>
    </div>
  </div>
</button>
