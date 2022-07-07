<script lang="ts">
  import { processMarkdown } from '../../markdown';
  import type { PageData } from './_lib';
  import { authState, signIn, signOut, getIdToken } from './_lib/auth';
  import axios from 'axios';
  import * as base64 from '@stablelib/base64';

  let edit = false;
  export let slug: string;
  export let data: PageData;
  let editingContent = data.content;
  let editingSha = data.sha;

  $: output = processMarkdown({
    content: data.content
  });
  $: signedIn = typeof $authState === 'object';

  let permissionPromise: Promise<boolean> | undefined;
  $: {
    if (signedIn && !permissionPromise && edit) {
      permissionPromise = checkPermission();
    } else if (!signIn && permissionPromise) {
      permissionPromise = undefined;
    }
  }

  function getUrl() {
    const baseUrl =
      'https://directcommit-production.up.railway.app/api/mountpoints/creatorsgarten-wiki/contents/';
    return baseUrl + slug + '.md';
  }
  async function checkPermission(): Promise<boolean> {
    const idToken = await getIdToken();
    const response = await axios.get(getUrl(), {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });
    editingContent = new TextDecoder().decode(
      base64.decode(response.data.content.replace(/\s/g, ''))
    );
    editingSha = response.data.sha;
    return response.data.directcommit.permissions.write;
  }

  let submitting = false;
  let submittingResult: Promise<true> | undefined;
  async function onSubmit() {
    submitting = true;
    try {
      const resultPromise = (async () => {
        const idToken = await getIdToken();
        const response = await axios.put(
          getUrl(),
          {
            content: base64.encode(new TextEncoder().encode(editingContent)),
            sha: editingSha,
            message: 'Update'
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          }
        );
        editingSha = response.data.content.sha;
        setTimeout(() => {
          location.reload();
        }, 1000);
        return true as const;
      })();
      submittingResult = resultPromise;
      await resultPromise;
    } finally {
      submitting = false;
    }
  }
</script>

<div class="cg-container">
  <h1 class="text-3xl md:text-4xl font-bold mt-16">
    {slug}
    <button
      class="inline-block"
      title="Edit"
      on:click={() => (edit = !edit)}
      class:hidden={$authState === 'checking'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
        <path
          fill-rule="evenodd"
          d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"
        />
      </svg>
    </button>
  </h1>
  <article class="prose md:prose-lg max-w-none" class:hidden={edit}>
    {@html output.html}
  </article>
  <form class:hidden={!edit} on:submit|preventDefault={onSubmit}>
    {#if $authState === 'unauthenticated'}
      <p>
        To edit this page, please <button class="text-blue-700" type="button" on:click={signIn}
          >sign in with GitHub</button
        >.
      </p>
    {:else if typeof $authState === 'object'}
      <p>
        You are signed in as <strong>{$authState.name}</strong>.
        <button type="button" class="text-blue-700" on:click={signOut}>[sign out]</button>
      </p>
      {#if permissionPromise}
        {#await permissionPromise}
          <p>Checking permissions…</p>
        {:then permission}
          {#if permission}
            <div class="border rounded border-gray-400 overflow-hidden">
              <textarea bind:value={editingContent} class="block w-full h-[32em] font-mono" />
            </div>
            <p class="my-2">
              <button
                class="rounded-md border-2 border-black px-2 py-1 hover:bg-gray-200"
                disabled={submitting}
              >
                Save
              </button>
              {#if submittingResult}
                {#await submittingResult}
                  Saving…
                {:then _result}
                  Saved
                {:catch error}
                  Unable to save! {String(error)}
                {/await}
              {/if}
            </p>
            <p class="text-xs">sha: {editingSha}</p>
          {:else}
            <p>You don't have permission to edit this page.</p>
            <p>You must be a creatorsgarten GitHub organization member to edit this wiki.</p>
          {/if}
        {:catch error}
          <p>Unable to check permissions: {String(error)}</p>
        {/await}
      {:else}
        …
      {/if}
    {/if}
  </form>
</div>
