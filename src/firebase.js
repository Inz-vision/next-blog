// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "next-blog-inz.firebaseapp.com",
  projectId: "next-blog-inz",
  storageBucket: "next-blog-inz.firebasestorage.app",
  messagingSenderId: "774839420042",
  appId: "1:774839420042:web:0e315dfb4ff73695b59973"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);