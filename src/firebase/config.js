import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// פרטי התצורה של Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTDWRWxkJzroav_uTOYLwUJBMxZXeX90M",
  authDomain: "schoolmapping-9c86b.firebaseapp.com",
  projectId: "schoolmapping-9c86b",
  storageBucket: "schoolmapping-9c86b.firebasestorage.app",
  messagingSenderId: "865661579425",
  appId: "1:865661579425:web:4befbbfe683951bd2540e0",
  measurementId: "G-WBV2ZRX3Q7"
};

// תנאי להפעלת אנליטיקס רק בצד הלקוח
let app;
let analytics = null;
let db;
let auth;

// בדיקה אם אנחנו בסביבת לקוח (דפדפן)
if (typeof window !== 'undefined') {
  // אתחול Firebase בצד הלקוח
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  // טעינה דינמית של אנליטיקס רק בצד הלקוח
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(err => {
    console.error('Error loading analytics:', err);
  });
} else {
  // אתחול Firebase בצד השרת (ללא אנליטיקס)
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth, analytics };

