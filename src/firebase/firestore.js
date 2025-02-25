// src/firebase/firestore.js
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc,
    deleteDoc,
    doc,
    getDoc
  } from "firebase/firestore";
  import { db } from "./config";
  
  // קבלת נתונים מקולקציה לפי מזהה ארגון
  export const getOrganizationData = async (collectionName, organizationId) => {
    try {
      const q = query(
        collection(db, collectionName), 
        where("organizationId", "==", organizationId)
      );
      
      const querySnapshot = await getDocs(q);
      const data = [];
      
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data };
    } catch (error) {
      console.error(`שגיאה בקבלת נתוני ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  };
  
  // הוספת נתונים לקולקציה
  export const addData = async (collectionName, data, organizationId) => {
    try {
      const dataWithOrg = {
        ...data,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, collectionName), dataWithOrg);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`שגיאה בהוספת נתון ל-${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  };
  
  // עדכון נתונים בקולקציה
  export const updateData = async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      
      // קבלת הנתון הקיים
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("הנתון לא נמצא");
      }
      
      // בדיקה שהנתון שייך לארגון הנכון (אם יש צורך)
      
      const updatedData = {
        ...data,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updatedData);
      return { success: true };
    } catch (error) {
      console.error(`שגיאה בעדכון נתון ב-${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  };
  
  // מחיקת נתון מהקולקציה
  export const deleteData = async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      
      // קבלת הנתון הקיים
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("הנתון לא נמצא");
      }
      
      // בדיקה שהנתון שייך לארגון הנכון (אם יש צורך)
      
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error(`שגיאה במחיקת נתון מ-${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  };
  
  // קבלת נתון בודד לפי מזהה
  export const getDocumentById = async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "הנתון לא נמצא" };
      }
    } catch (error) {
      console.error(`שגיאה בקבלת נתון מ-${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  };