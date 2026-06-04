import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFnvG7IZPHjGCRQNEEamsQjvKDAeaghhU",
  authDomain: "jasageh-46e3e.firebaseapp.com",
  projectId: "jasageh-46e3e",
  storageBucket: "jasageh-46e3e.firebasestorage.app",
  messagingSenderId: "312938762327",
  appId: "1:312938762327:web:14d5e1c916c4bd1edd5312",
  measurementId: "G-29PD7QCZ97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
