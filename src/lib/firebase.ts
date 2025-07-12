<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
=======
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
>>>>>>> 358eaea (add player authentication and data storage using player's emaial and pas)
=======
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
>>>>>>> 13f825aea5d340d73ac76a729b4d394c5580accd

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
<<<<<<< HEAD
<<<<<<< HEAD
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// A robust check to see if an app is already initialized to avoid errors during hot-reloads.
=======
};

// Initialize Firebase
>>>>>>> 13f825aea5d340d73ac76a729b4d394c5580accd
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

<<<<<<< HEAD
export { app, auth, db, googleProvider };
=======
// This file is no longer in use as Firebase has been removed from the project.
>>>>>>> a16c741 (FirebaseError: Firebase: Error (auth/unauthorized-domain)., I'm just tir)
=======
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
>>>>>>> 358eaea (add player authentication and data storage using player's emaial and pas)
=======
export { app, auth, db };
>>>>>>> 13f825aea5d340d73ac76a729b4d394c5580accd
