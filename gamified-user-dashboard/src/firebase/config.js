// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Required for db

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBskq3VXnw2VPaQJI1nTp1U-FVGVa7r0Qc",
  authDomain: "gamifieddashboard-26a29.firebaseapp.com",
  projectId: "gamifieddashboard-26a29",
  storageBucket: "gamifieddashboard-26a29.firebasestorage.app",
  messagingSenderId: "432056712683",
  appId: "1:432056712683:web:86b7c7adee0a911ed42dae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Add these lines
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
