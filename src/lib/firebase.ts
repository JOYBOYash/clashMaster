// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from './firebase-config';

if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key is missing. Please check your src/lib/firebase-config.ts file.');
}

// Initialize Firebase
// Prevents Firebase from initializing multiple times in development
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
