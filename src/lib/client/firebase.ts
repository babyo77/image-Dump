import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "image--match.firebaseapp.com",
  projectId: "image--match",
  storageBucket: "image--match.appspot.com",
  messagingSenderId: "449732647565",
  appId: "1:449732647565:web:1c74984b6f7882274ea0c4",
  measurementId: "G-N6M0SXHL2C",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();
