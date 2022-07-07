import { writable } from 'svelte/store';

export const authState = writable<AuthState>('checking');

export let signIn = () => {
  // This will be replaced when Firebase is loaded.
};
export let signOut = () => {
  // This will be replaced when Firebase is loaded.
};
export let getIdToken = (): Promise<string> => {
  // This will be replaced when Firebase is loaded.
};

type AuthState =
  | 'checking'
  | 'unauthenticated'
  | {
      name: string;
    };

if (typeof window !== 'undefined') {
  import('./firebase').then(({ auth, onAuthUpdate, signInWithGitHub, signOutFromFirebase }) => {
    signIn = () => {
      signInWithGitHub();
    };
    signOut = () => {
      signOutFromFirebase();
    };
    getIdToken = () => {
      if (!auth.currentUser) {
        throw new Error('User is not signed in');
      }
      return auth.currentUser.getIdToken();
    };

    const updateAuthState = () => {
      authState.set(
        auth.currentUser
          ? { name: auth.currentUser.displayName || auth.currentUser.email || auth.currentUser.uid }
          : 'unauthenticated'
      );
    };
    updateAuthState();
    onAuthUpdate(updateAuthState);
  });
}
