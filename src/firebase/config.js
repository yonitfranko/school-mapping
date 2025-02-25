// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTDWRWxkJzroav_uTOYLwUJBMxZXeX90M",
  authDomain: "schoolmapping-9c86b.firebaseapp.com",
  projectId: "schoolmapping-9c86b",
  storageBucket: "schoolmapping-9c86b.firebasestorage.app",
  messagingSenderId: "865661579425",
  appId: "1:865661579425:web:4befbbfe683951bd2540e0",
  measurementId: "G-WBV2ZRX3Q7"
};

// יצירת אובייקטי Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, analytics };




/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTDWRWxkJzroav_uTOYLwUJBMxZXeX90M",
  authDomain: "schoolmapping-9c86b.firebaseapp.com",
  projectId: "schoolmapping-9c86b",
  storageBucket: "schoolmapping-9c86b.firebasestorage.app",
  messagingSenderId: "865661579425",
  appId: "1:865661579425:web:4befbbfe683951bd2540e0",
  measurementId: "G-WBV2ZRX3Q7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/


