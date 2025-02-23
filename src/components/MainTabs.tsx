"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ייבוא הקומפוננטות מתיקיית school
import SchoolDetails from '@/components/school/SchoolDetails';
import SchoolRatingSystem from '@/components/school/SchoolRatingSystem';
import PostMappingQuestions from '@/components/school/PostMappingQuestions';
import WeightsCalculator from '@/components/school/WeightsCalculator';
import MentoringModels from '@/components/school/MentoringModels';
import DecisionAppendixRatingSystem from '@/components/school/DecisionAppendixRatingSystem';
import TrackingForm from '@/components/school/TrackingForm';

const handleSaveAllData = () => {
  // בהמשך נוסיף כאן את הלוגיקה של השמירה ל-Supabase
  alert('בקרוב: שמירת נתונים למסד הנתונים');
};
    
const MainTabs = () => {
  return (
    <div className="container mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
        מיפוי בית ספר
      </h1>
      
      <Tabs defaultValue="part-a" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-white">
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
            מודלי חניכה
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
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-right" style={{ color: '#0064ff' }}>
                חלק ו׳ - מודלי חניכה מומלצים
              </h2>
              <MentoringModels />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="part-e">
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
      <div className="fixed bottom-4 left-4">
        <Button 
          onClick={handleSaveAllData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          שמור את כל הנתונים
        </Button>
      </div>
    </div>
  );
};

export default MainTabs;