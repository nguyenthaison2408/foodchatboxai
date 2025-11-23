// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // import Firestore
import { getAnalytics } from "firebase/analytics";

// Firebase config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyATAKiygvnDMeuFj__CMLAfy4FU-Zv1FKc",
  authDomain: "trituenhantao-10209.firebaseapp.com",
  projectId: "trituenhantao-10209",
  storageBucket: "trituenhantao-10209.firebasestorage.app",
  messagingSenderId: "505745289864",
  appId: "1:505745289864:web:88a10811781cb33d38e53d",
  measurementId: "G-JY4BTNPMPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app); // <-- export db để dùng ở ChatBox.js
