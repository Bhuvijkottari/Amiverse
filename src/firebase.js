// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDz52RqM95hphOjeFIblIq34-EoIs0Lpik",
  authDomain: "amiverse-d89e2.firebaseapp.com",
  projectId: "amiverse-d89e2",
  storageBucket: "amiverse-d89e2.firebasestorage.app",
  messagingSenderId: "768688379111",
  appId: "1:768688379111:web:3c0e95cf9377a32a477e42"
};
const app = initializeApp(firebaseConfig);

// ✅ Create all instances once
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ Export them once only
export { app, auth, db, provider };