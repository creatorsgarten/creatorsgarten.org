<script lang="ts">
  import { EditorSettings } from './editorSettings'

  export let editable: boolean
  export let defaultValue: string

  function updateFont(e: Event) {
    const checkbox = e.target as HTMLInputElement
    EditorSettings.setKey('font', checkbox.checked ? 'mono' : 'sans')
  }
</script>

<div class="mb-2 flex gap-2">
  <label
    ><input
      type="checkbox"
      checked={$EditorSettings.font === 'mono'}
      on:change={updateFont}
    /> Use monospace font</label
  >
</div>

<textarea
  name="content"
  class={`w-full p-4 ${
    $EditorSettings.font === 'mono' ? 'font-mono' : 'font-prose'
  } text-sm rounded-xl disabled:cursor-not-allowed border-2 border-black ${
    editable ? '' : ''
  }`}
  disabled={!editable}
  rows={40}
  value={defaultValue}
/>
