"use client"

import React, { useState, useEffect } from 'react';

// הגדרת טיפוס עבור הקריטריונים
type CriteriaRating = {
  key: string;
  label: string;
  levels: string[];
  currentLevel: number;
};

const DecisionAppendixRatingSystem: React.FC = () => {
  // פונקציית עזר להשגת מזהה טופס נוכחי
  const getCurrentFormId = () => {
    // ניתן להשיג את מזהה הטופס מפרמטרים בכתובת URL
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    return formId || 'new';  // 'new' כברירת מחדל אם אין מזהה
  };

  // מערך הקריטריונים
  const [criteriaData, setCriteriaData] = useState<CriteriaRating[]>([
    { 
      key: 'organizationalInfrastructure', 
      label: 'תשתית ארגונית',
      levels: [
        'תשתית חלשה',
        'תשתית חלקית', 
        'תשתית מבוססת'
      ],
      currentLevel: 0
    },
    { 
      key: 'workProcesses', 
      label: 'תהליכי עבודה',
      levels: [
        'העדר תהליכים סדורים',
        'תהליכים קיימים אך לא תמיד סדורים', 
        'תהליכים סדורים ומתועדים'
      ],
      currentLevel: 0
    },
    { 
      key: 'staff', 
      label: 'צוות',
      levels: [
        'זקוק להכשרה משמעותית',
        'בתהליכי התמקצעות', 
        'מקצועי ומיומן'
      ],
      currentLevel: 0
    },
    { 
      key: 'improvementAwareness', 
      label: 'מודעות לשיפור',
      levels: [
        'קשיים בזיהוי צרכי שיפור',
        'מודעות לצורך בשיפור', 
        'תרבות של שיפור מתמיד'
      ],
      currentLevel: 0
    },
    { 
      key: 'achievements', 
      label: 'הישגים',
      levels: [
        'הישגים נמוכים',
        'הישגים ממוצעים', 
        'הישגים גבוהים ועקביים'
      ],
      currentLevel: 0
    },
    { 
      key: 'initiatives', 
      label: 'יוזמות',
      levels: [
        'מיעוט יוזמות',
        'יוזמות מקומיות', 
        'יוזמות חינוכיות מגוונות'
      ],
      currentLevel: 0
    },
    { 
      key: 'collaborations', 
      label: 'שיתופי פעולה',
      levels: [
        'שיתופי פעולה מוגבלים',
        'שיתופי פעולה בסיסיים', 
        'שיתופי פעולה פוריים'
      ],
      currentLevel: 0
    }
  ]);

  // טעינת הנתונים בעת טעינת הקומפוננטה
  useEffect(() => {
    const formId = getCurrentFormId();
    
    // טעינת נתונים מ-localStorage עם מזהה בית ספר
    const savedData = localStorage.getItem(`decisionAppendix_${formId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCriteriaData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // פונקציה לשינוי רמת קריטריון
  const handleRatingChange = (index: number, level: number) => {
    const formId = getCurrentFormId();
    const updatedCriteria = [...criteriaData];
    updatedCriteria[index].currentLevel = level;
    setCriteriaData(updatedCriteria);
    
    // שמירה ב-localStorage עם מזהה בית ספר
    localStorage.setItem(`decisionAppendix_${formId}`, JSON.stringify(updatedCriteria));
    
    // עדכון גם ב-localStorage הקיים לתאימות לאחור
    localStorage.setItem('decisionAppendix', JSON.stringify({
      ratings: updatedCriteria
    }));
  };

  // פונקציה לקביעת רמת ליווי
  const getSupportLevel = () => {
    const averageRating = criteriaData.reduce((sum, criteria) => sum + criteria.currentLevel, 0) / criteriaData.length;
    
    if (averageRating < 1) return 'טרם דורג';
    if (averageRating < 1.5) return 'ליווי דחוף';
    if (averageRating < 2) return 'ליווי מלא';
    if (averageRating < 2.5) return 'ליווי חלקי';
    return 'ליווי מצומצם';
  };

  // פונקציה לקביעת צבע
  const getLevelColor = (level: number) => {
    switch(level) {
      case 0: return 'bg-white border';
      case 1: return 'bg-red-200';
      case 2: return 'bg-yellow-200';
      case 3: return 'bg-green-200';
      default: return 'bg-white border';
    }
  };

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-2xl mb-4 text-right">נספח לקבלת החלטה - הערכת רמת תמיכה בבית ספר</h2>
      
      <table className="w-full border-collapse text-right" dir="rtl">
        <thead>
          <tr>
            <th className="border p-2 text-right">קריטריון</th>
            <th className="border p-2 text-right">רמה 1 - נמוכה</th>
            <th className="border p-2 text-right">רמה 2 - בינונית</th>
            <th className="border p-2 text-right">רמה 3 - גבוהה</th>
          </tr>
        </thead>
        <tbody>
          {criteriaData.map((criteria, index) => (
            <tr key={criteria.key}>
              <td className="border p-2 font-bold text-right">{criteria.label}</td>
              {[1, 2, 3].map((level) => (
                <td 
                  key={level} 
                  className={`border p-2 text-right cursor-pointer 
                    ${criteria.currentLevel === level 
                      ? getLevelColor(level) 
                      : 'hover:bg-gray-100'}`}
                  onClick={() => handleRatingChange(index, level)}
                >
                  {criteria.levels[level - 1]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 p-4 bg-gray-100 rounded text-right">
        <h3 className="text-xl font-bold">סיכום הערכה</h3>
        <p>רמת ליווי מוצעת: <span className="font-bold">{getSupportLevel()}</span></p>
      </div>
    </div>
  );
};

export default DecisionAppendixRatingSystem;