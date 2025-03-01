"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentoringModels from './MentoringModels'; // הקומפוננטה הקיימת של מודלי החניכה
import FinalSummary from './FinalSummary'; // הקומפוננטה הקיימת של סיכום והחלטה

const MentoringModelSelection = () => {
  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold mb-6">בחירת מודל חניכה</h2>
      
      <div className="space-y-8">
        {/* חלק ראשון: עיון במודלים */}
        <div>
          <h3 className="text-xl font-bold mb-4">עיון במודלים</h3>
          <MentoringModels />
        </div>
        
        {/* חלק שני: בחירה וסיכום */}
        <div className="mt-10">
          <FinalSummary />
        </div>
      </div>
    </div>
  );
};

export default MentoringModelSelection;