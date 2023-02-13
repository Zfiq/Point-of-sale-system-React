import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "reactpos-89add.firebaseapp.com",
  databaseURL: "https://reactpos-89add-default-rtdb.firebaseio.com",
  projectId: "reactpos-89add",
  storageBucket: "reactpos-89add.appspot.com",
  messagingSenderId: "216013502869",
  appId: "1:216013502869:web:d9be72feebe1c000845e9c",
  measurementId: "G-0CSX2B8VGX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export default app;
