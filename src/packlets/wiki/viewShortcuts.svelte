<script lang="ts">
  export let path: string

  function handleKeyPress(e: KeyboardEvent) {
    // Ignore keypresses if the user is typing in an input, textarea, select, etc.
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }

    if (e.key === 'e') {
      const editLink = document.querySelector('[data-js="wiki-edit-link"]')
      if (editLink) {
        e.preventDefault()
        ;(editLink as HTMLAnchorElement).click()
      }
      return
    }

    if (e.key === '.' && path) {
      e.preventDefault()
      const target = `https://github.dev/creatorsgarten/wiki/blob/main/${path}`
      location.href = target
      return
    }
  }
</script>

<svelte:window on:keypress={handleKeyPress} />
