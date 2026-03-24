import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAj15zSTqBvyqUsWVYRz3tQlIEAniWTMWA",
  authDomain: "foodallpur-database.firebaseapp.com",
  projectId: "foodallpur-database",
  storageBucket: "foodallpur-database.appspot.com", // ✅ fixed
  messagingSenderId: "620274381926",
  appId: "1:620274381926:web:42eecfae77fe51fb0ca9a7",
  measurementId: "G-YH3W0J93QE"
};

// Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);