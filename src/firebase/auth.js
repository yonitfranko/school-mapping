// src/firebase/auth.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from "firebase/auth";
  import { 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs 
  } from "firebase/firestore";
  import { auth, db } from "./config";
  
  // התחברות למערכת
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // קבלת מידע נוסף על המשתמש מ-Firestore
      const userDetails = await getUserDetails(user.uid);
      
      return { success: true, user, userDetails };
    } catch (error) {
      console.error("שגיאת התחברות:", error);
      return { success: false, error: error.message };
    }
  };
  
  // יצירת משתמש חדש
  export const registerUser = async (email, password, userData) => {
    try {
      // יצירת המשתמש ב-Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // שמירת מידע נוסף על המשתמש ב-Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email,
        role: userData.role || "supervisor",
        organizationId: userData.organizationId || "org1",
        createdAt: new Date()
      });
      
      return { success: true, user };
    } catch (error) {
      console.error("שגיאת רישום:", error);
      return { success: false, error: error.message };
    }
  };
  
  // קבלת מידע משתמש לפי UID
  export const getUserDetails = async (uid) => {
    try {
      // חיפוש לפי UID בקולקציית המשתמשים
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // מצאנו את המשתמש
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error("שגיאה בקבלת פרטי משתמש:", error);
      return null;
    }
  };
  
  // התנתקות מהמערכת
  export const logoutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("שגיאת התנתקות:", error);
      return { success: false, error: error.message };
    }
  };
  
  // האזנה לשינויים במצב ההתחברות
  export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };