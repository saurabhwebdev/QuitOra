import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBccNxJmDMtxZa2UmOHyHsg5pGbhKsmUeY",
  authDomain: "habittracker-95088.firebaseapp.com",
  projectId: "habittracker-95088",
  storageBucket: "habittracker-95088.firebasestorage.app",
  messagingSenderId: "581309434323",
  appId: "1:581309434323:web:95ab0f5e1244936e6b0726"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 