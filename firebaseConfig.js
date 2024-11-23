import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

export const db = getFirestore(app);
