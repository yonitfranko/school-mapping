// src/firebase/firestore.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./config";

// פונקציה להוספת נתונים לקולקציה
export const addData = async (collectionName, data, organizationId) => {
  try {
    // הוספת מזהה ארגון וחותמות זמן
    const dataWithOrg = {
      ...data,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // הוספה ל-Firestore
    const docRef = await addDoc(collection(db, collectionName), dataWithOrg);
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// פונקציה לקבלת נתונים לפי מזהה ארגון
export const getOrganizationData = async (collectionName, organizationId) => {
  try {
    const q = query(
      collection(db, collectionName), 
      where("organizationId", "==", organizationId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const data = [];
    
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error getting data from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// פונקציה לקבלת מסמך לפי מזהה
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Document not found" };
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// פונקציה לעדכון מסמך קיים
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    
    // הוסף חותמת זמן עדכון
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date()
    };
    
    await updateDoc(docRef, dataWithTimestamp);
    return { success: true };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// פונקציה לקבלת נתונים אחרונים (למשל לדשבורד)
export const getRecentData = async (collectionName, organizationId, limitCount = 5) => {
  try {
    const q = query(
      collection(db, collectionName),
      where("organizationId", "==", organizationId),
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const data = [];
    
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error getting recent data from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};