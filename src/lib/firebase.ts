import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7q92wEWYC7AUYPpMgoCXu4sTDKZDjQRM",
  authDomain: "video-sharing-platform-cc4e2.firebaseapp.com",
  projectId: "video-sharing-platform-cc4e2",
  storageBucket: "video-sharing-platform-cc4e2.firebasestorage.app",
  messagingSenderId: "707297759354",
  appId: "1:707297759354:web:671624a5f56b40473c6bc3",
  measurementId: "G-8JJ3DRJ5J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();