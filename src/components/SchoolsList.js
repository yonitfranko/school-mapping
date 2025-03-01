// src/components/SchoolsList.js
"use client"

import React, { useState, useEffect } from 'react';
import { getOrganizationData, deleteDocument } from '@/firebase/firestore';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/firebase/auth'; // ייבוא פונקציית ההתנתקות

const SchoolsList = () => {
  const { userDetails } = useAuth();
  // קבלת הארגון מפרטי המשתמש במקום קבוע
  const organizationId = userDetails?.organizationId || "org1";

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
 
  useEffect(() => {
    async function loadSchools() {
      try {
        setLoading(true);
        
        const userOrgs = userDetails?.organizationId || ["org1"];
        let allSchools = [];
        
        // טעינת בתי ספר מכל ארגון
        for (const org of userOrgs) {
          const result = await getOrganizationData('forms', org);
          
          if (result.success) {
            allSchools = [...allSchools, ...result.data];
          }
        }
        
        // בדיקה אם יש בתי ספר
        if (allSchools.length > 0) {
          const schoolsMap = {};
          allSchools.forEach(form => {
            const schoolName = form.name || 'בית ספר ללא שם';
            const schoolId = form.id;
            
            // יתר הלוגיקה נשארת זהה
            let formUpdatedAt, existingUpdatedAt;
            
            if (form.updatedAt && typeof form.updatedAt.toDate === 'function') {
              formUpdatedAt = form.updatedAt.toDate();
            } else if (form.updatedAt instanceof Date) {
              formUpdatedAt = form.updatedAt;
            } else if (form.updatedAt) {
              formUpdatedAt = new Date(form.updatedAt);
            } else {
              formUpdatedAt = new Date();
            }
            
            if (schoolsMap[schoolName] && schoolsMap[schoolName].updatedAt) {
              if (typeof schoolsMap[schoolName].updatedAt.toDate === 'function') {
                existingUpdatedAt = schoolsMap[schoolName].updatedAt.toDate();
              } else if (schoolsMap[schoolName].updatedAt instanceof Date) {
                existingUpdatedAt = schoolsMap[schoolName].updatedAt;
              } else {
                existingUpdatedAt = new Date(schoolsMap[schoolName].updatedAt);
              }
            }
            
            if (!schoolsMap[schoolName] || !existingUpdatedAt || formUpdatedAt > existingUpdatedAt) {
              schoolsMap[schoolName] = {
                id: schoolId,
                name: schoolName,
                updatedAt: form.updatedAt,
                schoolcode: form.schoolcode || 'לא ידוע',
                data: form
              };
            }
          });
          
          const uniqueSchools = Object.values(schoolsMap);
          console.log("Unique schools found:", uniqueSchools);
          setSchools(uniqueSchools);
        } else {
          // במקרה ואין בתי ספר
          setSchools([]);
          console.log("No schools found");
        }
      } catch (err) {
        console.error("שגיאה בטעינת רשימת בתי הספר:", err);
        setError('שגיאה בטעינת רשימת בתי הספר');
      } finally {
        setLoading(false);
      }
    }
    
    loadSchools();
  }, [organizationId]);

  // פונקציה לטיפול בהתנתקות
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        router.push('/login'); // ניווט למסך ההתחברות
      } else {
        setError('שגיאה בהתנתקות: ' + result.error);
      }
    } catch (error) {
      console.error("שגיאה בהתנתקות:", error);
      setError('שגיאה בהתנתקות: ' + error.message);
    }
  };

  // פונקציית המחיקה צריכה להיות כאן, מחוץ ל-useEffect
  const handleDeleteSchool = async (schoolId, schoolName) => {
    // אישור לפני מחיקה
    if (!confirm(`האם אתה בטוח שברצונך למחוק את בית הספר "${schoolName}"?`)) {
      return; // המשתמש ביטל את המחיקה
    }
    
    try {
      const result = await deleteDocument('forms', schoolId);
      
      if (result.success) {
        // עדכון הרשימה המקומית כדי להסיר את בית הספר שנמחק
        setSchools(prevSchools => prevSchools.filter(school => school.id !== schoolId));
        alert(`בית הספר "${schoolName}" נמחק בהצלחה`);
      } else {
        alert(`שגיאה במחיקת בית הספר: ${result.error}`);
      }
    } catch (error) {
      console.error("שגיאה במחיקת בית הספר:", error);
      alert("שגיאה במחיקת בית הספר");
    }
  };

  const handleNewSchool = () => {
    // ניווט לדף הראשי עם מזהה חדש שיאותת ליצירת טופס חדש
    router.push('/?new=true');
  };

  const handleEditSchool = (schoolId) => {
    // ניווט לדף הראשי עם מזהה קיים לעריכה
    router.push(`/?id=${schoolId}`);
  };

  const formatDate = (dateValue) => {
    try {
      // אם זה timestamp של פיירבייס
      if (dateValue && typeof dateValue.toDate === 'function') {
        return dateValue.toDate().toLocaleDateString('he-IL');
      } 
      // אם זה תאריך רגיל
      else if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString('he-IL');
      } 
      // אם זה מחרוזת
      else if (dateValue) {
        return new Date(dateValue).toLocaleDateString('he-IL');
      }
      return 'לא ידוע';
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'לא ידוע';
    }
  };

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#0064ff' }}>רשימת בתי ספר</h1>
          <Button 
            onClick={handleLogout} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-4"
            variant="outline"
          >
            התנתק
          </Button>
        </div>
        <Button onClick={handleNewSchool} className="bg-sky-400 hover:bg-sky-700">
          + הוסף בית ספר חדש
        </Button>
      </div>
      
      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}
      
      {loading ? (
        <p className="text-center">טוען נתונים...</p>
      ) : schools.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded">
          <p className="mb-4">אין בתי ספר זמינים.</p>
          <Button onClick={handleNewSchool} className="bg-blue-600">צור בית ספר חדש</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{school.name}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  סמל מוסד: {school.schoolcode || 'לא ידוע'}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  עודכן: {formatDate(school.updatedAt)}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    onClick={() => handleDeleteSchool(school.id, school.name)} 
                    className="bg-rose-400 hover:bg-rose-600 ml-2"
                    variant="destructive"
                  >
                    מחק
                  </Button>
                  <Button 
                    onClick={() => handleEditSchool(school.id)} 
                     className="bg-gray-400 hover:bg-gray-600"
                  >
                    ערוך מיפוי
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolsList;