// src/app/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MainTabs from '@/components/MainTabs';
import { getDocumentById } from '@/firebase/firestore';
import Link from 'next/link';

export default function Home() {
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
            // טעינת הנתונים ללוקל סטורג' כדי שהטופס יוכל להשתמש בהם
            const data = result.data;
            
            // שמירת כל חלק בנפרד בלוקל סטורג'
            if (data.schoolDetails) localStorage.setItem('schoolDetails', JSON.stringify(data.schoolDetails));
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