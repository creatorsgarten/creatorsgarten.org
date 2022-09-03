<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let authenticatedEmail: string | undefined = undefined;
  export let awaitingOtpEmail: string | undefined = undefined;
  export let subscribed = false;
  export let awaitingMessage = false;
  export let working = false;
  export let subscribers = 0;

  let emailInput: HTMLInputElement | undefined = undefined;
  let otpInput: HTMLInputElement | undefined = undefined;
  let messageInput: HTMLInputElement | undefined = undefined;
</script>

<div class="flex flex-col gap-4 rounded-3xl border-2 bg-gray-50 p-6 text-center">
  {#if !authenticatedEmail}
    {#if !awaitingOtpEmail}
      <h3>Subscribe to get notified when we will organize this event</h3>
      <form
        class="flex flex-col justify-center gap-1 sm:flex-row"
        on:submit|preventDefault={() => dispatch('signIn', { email: emailInput?.value })}
      >
        <input
          type="email"
          class="w-full rounded-md border-2 border-gray-400 bg-white p-1 sm:w-[20em]"
          placeholder="youremail@domain.com"
          required
          bind:this={emailInput}
        />
        <button class="cg-btn" disabled={working}>Subscribe</button>
      </form>
    {:else}
      <h3>Enter the OTP sent to your email to confirm</h3>
      <form
        class="flex flex-row justify-center gap-1"
        on:submit|preventDefault={() => dispatch('otp', { otp: otpInput?.value })}
      >
        <input
          type="text"
          class="w-[8em] rounded-md border-2 border-gray-400 bg-white p-1"
          placeholder="000000"
          bind:this={otpInput}
        />
        <button class="cg-btn" disabled={working}>Confirm</button>
      </form>
    {/if}
  {:else if !subscribed}
    <h3>Subscribe to get notified when we will organize this event</h3>
    <form
      class="flex flex-row justify-center gap-1"
      on:submit|preventDefault={() => dispatch('subscribe')}
    >
      <button class="cg-btn" disabled={working}>Subscribe as {authenticatedEmail}</button>
    </form>
    <p class="text-sm">
      Not you?
      <a href="javascript:" on:click={() => dispatch('signout')}>Use a different email address</a>
    </p>
  {:else}
    <h3 class="text-green-600">
      <div class="inline-block align-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-check-circle-fill block"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
          />
        </svg>
      </div>
      You have subscribed to this idea
    </h3>
    {#if awaitingMessage}
      <p class="text-sm">
        Would you like to say something to our team? Feel free to leave us a message:
      </p>
      <form
        class="flex flex-col justify-center gap-1 sm:flex-row"
        on:submit|preventDefault={() => dispatch('message', { message: messageInput?.value })}
      >
        <input
          type="text"
          class="w-full rounded-md border-2 border-gray-400 bg-white p-1 sm:w-[28em]"
          placeholder="Say anything!!"
          bind:this={messageInput}
        />
        <button class="cg-btn" disabled={working}>Send</button>
      </form>
    {:else}
      <p class="text-sm">
        We will send an email to {authenticatedEmail} when there are updates about this event.
      </p>
      <div class="flex flex-col gap-1">
        <p class="text-sm">
          No longer interested?
          <a href="javascript:" on:click={() => dispatch('unsubscribe')}>Unsubscribe here</a>
        </p>
        <p class="text-sm">
          Not you? <a href="javascript:" on:click={() => dispatch('signout')}
            >Use a different email address</a
          >
        </p>
      </div>
    {/if}
  {/if}
  {#if subscribers > 0}
    <p class="text-sm text-gray-500">
      {subscribers == 1 ? '1 person has' : `${subscribers} people have`} subscribed to this idea
    </p>
  {/if}
</div>
