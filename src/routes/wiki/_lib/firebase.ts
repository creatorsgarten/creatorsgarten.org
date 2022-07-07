import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GithubAuthProvider,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCKZng55l411pps2HgMcuenMQou-NTQ0QE',
  authDomain: 'creatorsgarten-wiki.firebaseapp.com',
  projectId: 'creatorsgarten-wiki',
  storageBucket: 'creatorsgarten-wiki.appspot.com',
  messagingSenderId: '888124624946',
  appId: '1:888124624946:web:1fcf89b503063b38726c2b',
  measurementId: 'G-YP1R2WZZMW'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const authCheckedPromise = new Promise<boolean>((resolve) => {
  onAuthStateChanged(auth, () => {
    resolve(true);
  });
});
export const onAuthUpdate = (f: () => void) => {
  onAuthStateChanged(auth, f);
};
export const signInWithGitHub = async () => {
  try {
    await signInWithPopup(auth, new GithubAuthProvider());
  } catch (error) {
    console.error(error);
    alert(`Unable to sign in: ${error}`);
  }
};
export const signOutFromFirebase = () => {
  signOut(auth);
};
