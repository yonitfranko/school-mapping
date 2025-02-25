// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getUserDetails } from '../firebase/auth';

// יצירת הקונטקסט
const AuthContext = createContext();

// שימוש בקונטקסט
export const useAuth = () => {
  return useContext(AuthContext);
};

// ספק הקונטקסט
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // האזנה לשינויים במצב ההתחברות
    const unsubscribe = onAuthChange(async (user) => {
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

    // ניקוי האזנה בעת עזיבת הקומפוננטה
    return unsubscribe;
  }, []);

  // הערכים שיהיו זמינים לכל הקומפוננטות דרך הקונטקסט
  const value = {
    currentUser,
    userDetails,
    isAdmin: userDetails?.role === 'admin',
    organizationId: userDetails?.organizationId,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};