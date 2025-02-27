"use client"

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainTabs from '@/components/MainTabs';
import { getDocumentById } from '@/firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const formId = searchParams.get('id');
  const isNew = searchParams.get('new');
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(!!formId);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadForm() {
      if (formId) {
        try {
          setLoading(true);
          const result = await getDocumentById('forms', formId);
          
          if (result.success) {
            console.log("Raw form data from Firestore:", result.data);
            const data = result.data;
            
            // יצירת אובייקט schoolDetails מהנתונים השטוחים
            const schoolDetails = {
              schoolName: data.name || '',
              schoolSymbol: data.schoolcode || '',
              educationStage: data.educationStage || ''
            };
            
            // יצירת מבנה תלמידים אם קיים
            if (data.students) {
              const studentsData = {
                regularStudents: data.students.regular || '',
                specialEdStudents: data.students.specialEd || '',
                differentialStudents: data.students.differential || ''
              };
              
              // הוספת נתוני תלמידים לאובייקט schoolDetails
              Object.assign(schoolDetails, studentsData);
            }
            
            // יצירת מבנה מורים אם קיים
            if (data.teachers) {
              const teachersData = {
                teachersExp1to5: data.teachers.exp1to5 || '',
                teachersExp5to10: data.teachers.exp5to10 || '',
                teachersExp10Plus: data.teachers.exp10Plus || ''
              };
              
              // הוספת נתוני מורים לאובייקט schoolDetails
              Object.assign(schoolDetails, teachersData);
            }
            
            // שמירה ב-localStorage
            console.log("Saving schoolDetails to localStorage:", schoolDetails);
            localStorage.setItem('schoolDetails', JSON.stringify(schoolDetails));
            
            // אם יש גם נתונים מובנים, השתמש בהם
            if (data.schoolDetails) {
              console.log("Original schoolDetails structure found:", data.schoolDetails);
              localStorage.setItem('originalSchoolDetails', JSON.stringify(data.schoolDetails));
            }
            
            // העתקת שאר הנתונים כפי שהם (אם קיימים)
            if (data.ratingSystem) localStorage.setItem('ratingSystem', JSON.stringify(data.ratingSystem));
            if (data.postMappingQuestions) localStorage.setItem('postMappingQuestions', JSON.stringify(data.postMappingQuestions));
            if (data.weightsCalculator) localStorage.setItem('weightsCalculator', JSON.stringify(data.weightsCalculator));
            if (data.mentoringModels) localStorage.setItem('mentoringModels', JSON.stringify(data.mentoringModels));
            if (data.decisionAppendix) localStorage.setItem('decisionAppendix', JSON.stringify(data.decisionAppendix));
            if (data.trackingForm) localStorage.setItem('trackingForm', JSON.stringify(data.trackingForm));
            
            setFormData(data);
          } else {
            setError('לא ניתן למצוא את הטופס המבוקש');
          }
        } catch (err) {
          console.error("שגיאה בטעינת הטופס:", err);
          setError('שגיאה בטעינת הטופס');
        } finally {
          setLoading(false);
        }
      } else if (isNew) {
        // ניקוי נתונים קודמים
        localStorage.removeItem('schoolDetails');
        localStorage.removeItem('ratingSystem');
        localStorage.removeItem('postMappingQuestions');
        localStorage.removeItem('weightsCalculator');
        localStorage.removeItem('mentoringModels');
        localStorage.removeItem('decisionAppendix');
        localStorage.removeItem('trackingForm');
        setLoading(false);
      }
    }
    
    loadForm();
  }, [formId, isNew]);

  return (
    <main className="min-h-screen p-4 bg-gray-50" dir="rtl">
      <div className="mb-4">
        <Link href="/schools" className="text-blue-600 hover:underline">
          &larr; חזרה לרשימת בתי הספר
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center p-8">
          <p>טוען נתונים...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <p>{error}</p>
          <Link href="/schools" className="text-blue-600 hover:underline mt-2 inline-block">
            חזרה לרשימת בתי הספר
          </Link>
        </div>
      ) : (
        <MainTabs formId={formId} />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}