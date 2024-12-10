import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCI-UwsRwYa0utqR48V34aRcfslYHJMIyM",
  authDomain: "weatherwear-abaae.firebaseapp.com",
  projectId: "weatherwear-abaae",
  storageBucket: "weatherwear-abaae.firebasestorage.app",
  messagingSenderId: "1095158164948",
  appId: "1:1095158164948:web:da4931f206348ea8d53a41",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
