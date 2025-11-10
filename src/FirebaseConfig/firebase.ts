import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUNHgwV5fUERCAgEPgCU3PFr6uyg-Hdfk",
  authDomain: "footballpredict-26f20.firebaseapp.com",
  projectId: "footballpredict-26f20",
  storageBucket: "footballpredict-26f20.firebasestorage.app",
  messagingSenderId: "592681050188",
  appId: "1:592681050188:web:77602cc86d2e2dac3154e9",
  measurementId: "G-0LBXRL2SB0"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  login_hint: '',
  popup_mode: 'true'
});
