<script lang="ts">
  import type { PageData } from './types';
  import { authState, signIn, signOut, getIdToken } from './auth';
  import axios from 'axios';
  import * as base64 from '@stablelib/base64';

  export let editing = false;
  export let slug: string;
  export let data: PageData;

  let editingContent = data.content || '';
  let editingSha = data.sha;

  $: signedIn = typeof $authState === 'object';

  let permissionPromise: Promise<boolean> | undefined;
  $: {
    if (signedIn && !permissionPromise && editing) {
      permissionPromise = checkPermission();
    } else if (!signIn && permissionPromise) {
      permissionPromise = undefined;
    }
  }

  function getUrl() {
    const baseUrl = 'https://directcommit.spacet.me/api/mountpoints/creatorsgarten-wiki/contents/wiki/';
    return baseUrl + slug + '.md';
  }

  async function checkPermission(): Promise<boolean> {
    const idToken = await getIdToken();
    const response = await axios
      .get(getUrl(), {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
      .catch((e) => {
        if (e.response?.status === 404) {
          return e.response;
        }
        throw e;
      });
    editingContent = new TextDecoder().decode(
      base64.decode((response.data.content || '').replace(/\s/g, ''))
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
            message: 'Update ' + slug
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

<form on:submit|preventDefault={onSubmit}>
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
            <textarea bind:value={editingContent} class="block w-full h-[32em] font-mono p-2" />
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
  <p class="mt-8">
    You can also edit <a href="https://github.com/creatorsgarten/wiki/blob/main/wiki/{slug}.md"
      >this page on GitHub</a
    >
    or on <a href="https://github.dev/creatorsgarten/wiki/blob/main/wiki/{slug}.md">GitHub.dev</a>.
  </p>
</form>
