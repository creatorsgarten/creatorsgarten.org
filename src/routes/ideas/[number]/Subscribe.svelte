<script lang="ts">
</script>

<div class="card">
  <h3>Subscribe to get notified when we will organize this event</h3>
  <form class="mt-4 flex flex-col justify-center gap-1 sm:flex-row">
    <input
      type="email"
      class="w-full rounded-md border-2 border-gray-400 bg-white p-1 sm:w-[20em]"
      placeholder="youremail@domain.com"
    />
    <button class="cg-btn">Subscribe</button>
  </form>
</div>

<div class="card">
  <h3>Enter the OTP sent to your email to confirm</h3>
  <form class="mt-4 flex flex-row justify-center gap-1">
    <input
      type="text"
      class="w-[8em] rounded-md border-2 border-gray-400 bg-white p-1"
      placeholder="000000"
    />
    <button class="cg-btn">Confirm</button>
  </form>
</div>

<div class="card">
  <h3>Subscribe to get notified when we will organize this event</h3>
  <form class="mt-4 flex flex-row justify-center gap-1">
    <button class="cg-btn">Subscribe as email@email.email</button>
  </form>
  <p class="mt-3 text-sm">
    Not you? <a href="javascript:">Use a different email address</a>
  </p>
</div>

<div class="card">
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
    You have subscribed to this event
  </h3>
  <p class="mt-3 text-sm">
    Would you like to say something to our team? Feel free to leave us a message:
  </p>
  <form class="mt-4 flex flex-col justify-center gap-1 sm:flex-row">
    <input
      type="text"
      class="w-full rounded-md border-2 border-gray-400 bg-white p-1 sm:w-[28em]"
      placeholder="Say anything!!"
    />
    <button class="cg-btn">Send</button>
  </form>
</div>

<div class="card">
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
    You have subscribed to this event
  </h3>
  <p class="mt-3 text-sm">
    We will send an email to your@email.com when there are updates about this event.
  </p>
  <p class="mt-3 text-sm">
    No longer interested? <a href="javascript:">Unsubscribe here</a>
  </p>
  <p class="mt-1 text-sm">
    Not you? <a href="javascript:">Use a different email address</a>
  </p>
</div>

<style>
  .card {
    @apply rounded-3xl border-2 bg-gray-50 p-6 text-center;
  }
</style>
