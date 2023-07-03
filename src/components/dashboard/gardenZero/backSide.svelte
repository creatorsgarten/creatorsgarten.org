<script lang="ts">
  import { onMount } from 'svelte'

  import type { AuthenticatedUser } from '$types/AuthenticatedUser'

  interface AccessCard {
    accessKey: string
    expiresAt: Date
  }

  export let user: AuthenticatedUser
  export let accessCard: AccessCard

  const getTimeDiffInSeconds = (date: Date) =>
    Math.floor((date.valueOf() - new Date().valueOf()) / 1000)

  let diffInSeconds = getTimeDiffInSeconds(accessCard.expiresAt)
  $: expireInMinute = Math.floor(diffInSeconds / 60)
  $: expireInSeconds = diffInSeconds - expireInMinute * 60

  onMount(() => {
    const interval = setInterval(() => {
      const newDiff = getTimeDiffInSeconds(accessCard.expiresAt)
      diffInSeconds = newDiff < 0 ? 0 : newDiff
    }, 1000)

    return () => clearInterval(interval)
  })
</script>

<div class="absolute inset-4 flex justify-between">
  <img
    alt=""
    class="h-full w-auto rounded-2xl"
    src={`/api/qr?${new URLSearchParams({
      value: accessCard.accessKey,
    })}`}
  />
  <div class="hidden flex-col justify-between text-right md:flex">
    <div>
      <p class="text-base">{user.uid}</p>
      <div class="text-2xl">
        <p class="font-medium">GARDEN ZERO</p>
        <p class="-mt-2">access card</p>
      </div>
    </div>
    <div class="text-2xl">
      <p class="font-medium">EXPIRE IN</p>
      <p class="-mt-1 mb-2 md:my-0 md:ml-3">
        {expireInMinute.toString().padStart(2, '0')}:{expireInSeconds
          .toString()
          .padStart(2, '0')}
      </p>
    </div>
  </div>
</div>
