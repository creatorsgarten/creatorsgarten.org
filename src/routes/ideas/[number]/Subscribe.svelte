<script lang="ts">
  import { onMount } from 'svelte';

  import SubscribeView from './SubscribeView.svelte';
  import { rejectOnError } from './supabase-utils';

  let awaitingOtpEmail = '';
  let authenticatedEmail = '';
  let subscribed = false;
  let awaitingMessage = false;
  let working = false;
  let subscribers = 0;
  export let listId: string;

  async function work<T>(f: () => Promise<void>): Promise<void> {
    if (working) return;
    working = true;
    try {
      return await f();
    } catch (error) {
      console.error(error);
      alert(`${error}`);
    } finally {
      working = false;
    }
  }

  const getSupabase = () => import('./supabase');

  async function onSignIn(e: CustomEvent) {
    const email: string = e.detail.email;
    return work(async () => {
      const { supabase } = await getSupabase();
      await rejectOnError(supabase.auth.signIn({ email }));
      awaitingOtpEmail = email;
    });
  }

  async function onOtp(e: CustomEvent) {
    const otp: string = e.detail.otp;
    return work(async () => {
      const { supabase } = await getSupabase();
      const result = await rejectOnError(
        supabase.auth.verifyOTP({
          email: awaitingOtpEmail,
          token: otp,
          type: 'magiclink'
        })
      );
      await rejectOnError(
        supabase.from('list_subscribers').insert({
          user_id: result.user!.id,
          list_id: listId
        })
      ).catch((error) => {
        if (error.cause?.code === '23505') {
          // ignore duplicate key error
        } else {
          throw error;
        }
      });
      awaitingOtpEmail = '';
      authenticatedEmail = result.user!.email || '';
      subscribed = true;
      awaitingMessage = true;
    });
  }

  async function onSubscribe() {
    return work(async () => {
      const { supabase } = await getSupabase();
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Not signed in');
      }
      await rejectOnError(
        supabase.from('list_subscribers').insert({
          user_id: user.id,
          list_id: listId
        })
      ).catch((error) => {
        if (error.cause?.code === '23505') {
          // ignore duplicate key error
        } else {
          throw error;
        }
      });
      subscribed = true;
      awaitingMessage = true;
    });
  }

  async function onUnsubscribe() {
    return work(async () => {
      const { supabase } = await getSupabase();
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Not signed in');
      }
      await rejectOnError(
        supabase.from('list_subscribers').delete().match({
          user_id: user.id,
          list_id: listId
        })
      );
      subscribed = false;
    });
  }

  async function onSignOut() {
    return work(async () => {
      const { supabase } = await getSupabase();
      await rejectOnError(supabase.auth.signOut());
      await refresh();
    });
  }

  async function onMessageSubmit(e: CustomEvent) {
    const message = e.detail.message;
    return work(async () => {
      const { supabase } = await getSupabase();
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Not signed in');
      }
      await rejectOnError(
        supabase.from('list_subscribers').update({ message }).match({
          user_id: user.id,
          list_id: listId
        })
      );
      awaitingMessage = false;
    });
  }

  async function refresh() {
    const { supabase } = await getSupabase();
    const currentUser = supabase.auth.user();
    if (currentUser) {
      authenticatedEmail = currentUser.email || '';
      const item = await rejectOnError(
        supabase
          .from('list_subscribers')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('list_id', listId)
      );
      if (item.data?.length) {
        subscribed = true;
      } else {
        subscribed = false;
      }
    } else {
      authenticatedEmail = '';
    }

    const result = await rejectOnError(
      supabase
        .from('list_subscribers')
        .select('user_id', { count: 'estimated', head: true })
        .eq('list_id', listId)
    );
    subscribers = result.count || 0;
  }

  onMount(() => {
    work(refresh);
  });
</script>

<SubscribeView
  {awaitingOtpEmail}
  {authenticatedEmail}
  {subscribed}
  {awaitingMessage}
  {working}
  {subscribers}
  on:signIn={onSignIn}
  on:otp={onOtp}
  on:subscribe={onSubscribe}
  on:message={onMessageSubmit}
  on:unsubscribe={onUnsubscribe}
  on:signout={onSignOut}
/>

<!-- <SubscribeView subscribers={2} />

<SubscribeView subscribers={2} awaitingOtpEmail={'email@domain.com'} />

<SubscribeView subscribers={2} authenticatedEmail={'email@domain.com'} />

<SubscribeView subscribers={2} authenticatedEmail={'email@domain.com'} subscribed awaitingMessage />

<SubscribeView subscribers={2} authenticatedEmail={'email@domain.com'} subscribed /> -->
