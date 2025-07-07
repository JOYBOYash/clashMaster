// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtmhUHkk5UZa_3SvY48ztwsPX6p685dKA",
  authDomain: "clashmaster-9344e.firebaseapp.com",
  projectId: "clashmaster-9344e",
  storageBucket: "clashmaster-9344e.appspot.com",
  messagingSenderId: "142180503144",
  appId: "1:142180503144:web:2b0e75afca8451d05b75dd",
  measurementId: "G-240XZY7RJT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
