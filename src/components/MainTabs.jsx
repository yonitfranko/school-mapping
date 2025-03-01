"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addData, updateDocument } from '@/firebase/firestore'; // עדכון הייבוא
import { useAuth } from '@/contexts/AuthContext';
import FinalSummary from '@/components/school/FinalSummary';
import { useRouter } from 'next/navigation';

// ייבוא הקומפוננטות מתיקיית school
import SchoolDetails from '@/components/school/SchoolDetails';
import SchoolRatingSystem from '@/components/school/SchoolRatingSystem';
import PostMappingQuestions from '@/components/school/PostMappingQuestions';
import WeightsCalculator from '@/components/school/WeightsCalculator';
import MentoringModels from '@/components/school/MentoringModels';
import DecisionAppendixRatingSystem from '@/components/school/DecisionAppendixRatingSystem';
import TrackingForm from '@/components/school/TrackingForm';
    
const MainTabs = ({ formId }) => {
  // בדיקה האם useAuth קיים
  const router = useRouter();
  let userDetails = null;
  try {
    const auth = useAuth();
    userDetails = auth?.userDetails;
  } catch (error) {
    console.error("שגיאה בקריאה ל-useAuth:", error);
  }

  const handleSaveAllData = async () => {
    try {
      // במקום לבדוק אם userDetails קיים, נשתמש בערך קבוע זמנית
      const organizationId = "org1"; // או שתשיג את זה בדרך אחרת
      
      // השג את כל הנתונים מה-localStorage
      const schoolDetails = JSON.parse(localStorage.getItem('schoolDetails') || '{}');
      const ratingSystem = JSON.parse(localStorage.getItem('ratingSystem') || '{}');
      const postMappingQuestions = JSON.parse(localStorage.getItem('postMappingQuestions') || '{}');
      const weightsCalculator = JSON.parse(localStorage.getItem('weightsCalculator') || '{}');
      const mentoringModels = JSON.parse(localStorage.getItem('mentoringModels') || '{}');
      const decisionAppendix = JSON.parse(localStorage.getItem('decisionAppendix') || '{}');
      const trackingForm = JSON.parse(localStorage.getItem('trackingForm') || '{}');
      const finalCheck = JSON.parse(localStorage.getItem('finalCheck') || '{}');
      const selectedModels = JSON.parse(localStorage.getItem('selectedModels') || '[]');
      const finalDecision = JSON.parse(localStorage.getItem('finalDecision') || '{}');

      // הכן את הנתונים לשמירה
      const formData = {
        schoolDetails,
        ratingSystem,
        postMappingQuestions,
        weightsCalculator,
        mentoringModels,
        decisionAppendix,
        trackingForm,
        finalCheck,
        selectedModels,
        finalDecision,
        name: schoolDetails.schoolName || 'מיפוי בית ספר',
        isActive: true,
        updatedAt: new Date()
      };

      let result;
      
      if (formId) {
        // עדכון טופס קיים
        result = await updateDocument('forms', formId, formData);
      } else {
        // הוספת טופס חדש
        result = await addData('forms', formData, organizationId);
      }

      if (result.success) {
        alert('הנתונים נשמרו בהצלחה!');
      } else {
        alert('שגיאה בשמירת הנתונים: ' + result.error);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('שגיאה בשמירת הנתונים:', error);
      alert('שגיאה בשמירת הנתונים: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
        מיפוי בית ספר
      </h1>
      
      <Tabs defaultValue="part-a" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-white">
          {/* הסרנו טאב אחד והוספנו טאב חדש של "בחירת מודל חניכה" במקום "מודלי חניכה" ו"סיכום והחלטה" */}
          <TabsTrigger 
            value="part-e" 
            className="text-right hover:bg-[#cceef5] data-[state=active]:bg-[#cceef5]"
          >
            מעקב ובקרה
          </TabsTrigger>
          <TabsTrigger 
            value="part-d" 
            className="text-right hover:bg-[#cceef5] data-[state=active]:bg-[#cceef5]"
          >
            בחירת מודל חניכה
          </TabsTrigger>
          <TabsTrigger 
            value="part-c" 
            className="text-right hover:bg-[#cceef5] data-[state=active]:bg-[#cceef5]"
          >
            חישובים ושאלות
          </TabsTrigger>
          <TabsTrigger 
            value="part-b" 
            className="text-right hover:bg-[#cceef5] data-[state=active]:bg-[#cceef5]"
          >
            מיפוי זירות
          </TabsTrigger>
          <TabsTrigger 
            value="part-a" 
            className="text-right hover:bg-[#cceef5] data-[state=active]:bg-[#cceef5]"
          >
            פרטי בית ספר
          </TabsTrigger>
        </TabsList>
  
        {/* התוכן של הטאבים */}
        <TabsContent value="part-a">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                חלק א׳ - פרטי בית הספר
              </h2>
              <SchoolDetails />
            </CardContent>
          </Card>
        </TabsContent>
  
        <TabsContent value="part-b">
          {/* תוכן של "מיפוי זירות" נשאר ללא שינוי */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                חלק ב׳ - מיפוי זירות ואתגרים
              </h2>
              <SchoolRatingSystem />
            </CardContent>
          </Card>
        </TabsContent>
  
        <TabsContent value="part-c">
          {/* תוכן של "חישובים ושאלות" נשאר ללא שינוי */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                    חלק ג׳ - חישוב משקולות
                  </h2>
                  <WeightsCalculator />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                    חלק ד׳ - שאלות לאחר המיפוי
                  </h2>
                  <PostMappingQuestions />
                </div>
  
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                    נספח לקבלת החלטה
                  </h2>
                  <DecisionAppendixRatingSystem />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  
        <TabsContent value="part-d">
          {/* טאב חדש שמשלב את "מודלי חניכה" ו"סיכום והחלטה" */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                בחירת מודל חניכה
              </h2>
              
              <div className="space-y-10">
                {/* חלק ראשון: מודלי חניכה */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-right">
                    עיון במודלים
                  </h3>
                  <MentoringModels />
                </div>
                
                {/* חלק שני: סיכום והחלטה */}
                <div className="mt-12 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-right">
                    בחירה וסיכום
                  </h3>
                  <FinalSummary />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  
        <TabsContent value="part-e">
          {/* תוכן של "מעקב ובקרה" נשאר ללא שינוי */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                מעקב ובקרה
              </h2>
              <TrackingForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-4 left-4 flex gap-2">
  <Button 
    onClick={handleSaveAllData}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
  >
    שמור את כל הנתונים
  </Button>
  <Button 
    onClick={() => router.push('/export')}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
  >
    ייצא לאקסל
  </Button>
</div>
           </div>
  );
};

export default MainTabs;