import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "servdomain-b7fea.firebaseapp.com",
  projectId: "servdomain-b7fea",
  storageBucket: "servdomain-b7fea.appspot.com",
  messagingSenderId: "709085190269",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-SFZPYK332J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
