// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmjnS0NHs4xjYsC7I0aueR-BypPcIaJQE",
  authDomain: "traveling-salesman-d2fa4.firebaseapp.com",
  projectId: "traveling-salesman-d2fa4",
  storageBucket: "traveling-salesman-d2fa4.appspot.com",
  messagingSenderId: "151193716232",
  appId: "1:151193716232:web:9f5a30dfe2667d6bd633bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
