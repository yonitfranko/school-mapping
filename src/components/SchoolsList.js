// src/components/SchoolsList.js
"use client"

import React, { useState, useEffect } from 'react';
import { getOrganizationData } from '@/firebase/firestore';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // השג את הארגון כרגע בצורה קבועה, בהמשך נקבל אותו מהתחברות המשתמש
  const organizationId = "org1";

  useEffect(() => {
    async function loadSchools() {
      try {
        setLoading(true);
        const result = await getOrganizationData('forms', organizationId);
        
        if (result.success) {
          // יצירת רשימה מסוננת של בתי ספר עם הסרת כפילויות
          const schoolsMap = {};
          result.data.forEach(form => {
            const schoolName = form.schoolDetails?.schoolName || form.name || 'בית ספר ללא שם';
            const schoolId = form.id;
            
            // בדיקה אם הטופס הזה כבר קיים ברשימה, והאם הוא חדש יותר
            if (!schoolsMap[schoolName] || new Date(form.updatedAt.toDate()) > new Date(schoolsMap[schoolName].updatedAt.toDate())) {
              schoolsMap[schoolName] = {
                id: schoolId,
                name: schoolName,
                updatedAt: form.updatedAt,
                data: form
              };
            }
          });
          
          const uniqueSchools = Object.values(schoolsMap);
          setSchools(uniqueSchools);
        } else {
          setError('שגיאה בטעינת נתוני בתי הספר');
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

  const handleNewSchool = () => {
    // ניווט לדף הראשי עם מזהה חדש שיאותת ליצירת טופס חדש
    router.push('/?new=true');
  };

  const handleEditSchool = (schoolId) => {
    // ניווט לדף הראשי עם מזהה קיים לעריכה
    router.push(`/?id=${schoolId}`);
  };

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0064ff' }}>רשימת בתי ספר</h1>
        <Button onClick={handleNewSchool} className="bg-green-600 hover:bg-green-700">
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
                  עודכן: {school.updatedAt.toDate().toLocaleDateString('he-IL')}
                </p>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleEditSchool(school.id)} 
                    className="bg-blue-600 hover:bg-blue-700"
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