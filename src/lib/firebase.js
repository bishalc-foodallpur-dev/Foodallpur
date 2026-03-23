import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAj15zSTqBvyqUsWVYRz3tQlIEAniWTMWA",
  authDomain: "foodallpur-database.firebaseapp.com",
  projectId: "foodallpur-database",
  storageBucket: "foodallpur-database.firebasestorage.app",
  messagingSenderId: "620274381926",
  appId: "1:620274381926:web:42eecfae77fe51fb0ca9a7",
  measurementId: "G-YH3W0J93QE"
};

const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);