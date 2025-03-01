// src/contexts/AuthContext.js
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // פונקציה לקבלת פרטי המשתמש מ-Firestore
  async function getUserDetails(uid) {
    try {
      // חיפוש המשתמש לפי uid
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }

  useEffect(() => {
    // מעקב אחר שינויים במצב ההתחברות
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // קבלת פרטי המשתמש מ-Firestore
        const details = await getUserDetails(user.uid);
        setUserDetails(details);
      } else {
        setUserDetails(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error: error.message };
    }
  }
  
  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    userDetails,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}