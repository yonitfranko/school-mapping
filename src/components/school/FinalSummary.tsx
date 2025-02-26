"use client"

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// התרחישים ומודלי החניכה - זהים למודל הקיים כדי לשמור על עקביות
const scenarioModels: Record<string, Array<{ id: string, title: string, color: string }>> = {
  limited: [
    { id: "systemic", title: "חניכה מערכתית", color: "bg-blue-50" },
    { id: "leadership", title: "חניכת עתודה ניהולית", color: "bg-green-50" },
    { id: "community", title: "חניכה מבוססת קהילות מקצועיות", color: "bg-purple-50" }
  ],
  partial: [
    { id: "group", title: "חניכה קבוצתית", color: "bg-teal-50" },
    { id: "peer", title: "חניכת עמיתים", color: "bg-indigo-50" },
    { id: "project", title: "חניכה מבוססת פרויקטים", color: "bg-amber-50" }
  ],
  full: [
    { id: "personal-mentoring", title: "חונכות אישית", color: "bg-rose-50" },
    { id: "coaching", title: "אימון", color: "bg-sky-50" },
    { id: "micro-mentoring", title: "מיקרו-חניכה", color: "bg-emerald-50" }
  ],
  emergency: [
    { id: "micro-mentoring-emergency", title: "מיקרו-חניכה", color: "bg-red-50" },
    { id: "speed-mentoring", title: "חונכות בזק", color: "bg-orange-50" },
    { id: "focused-coaching", title: "אימון ממוקד", color: "bg-lime-50" }
  ]
};

// כותרות התרחישים בעברית
const scenarioTitles: Record<string, string> = {
  limited: "ליווי מצומצם",
  partial: "ליווי חלקי",
  full: "ליווי מלא",
  emergency: "מצב חירום/דחיפות"
};

const FinalSummary = () => {
  const [finalCheck, setFinalCheck] = useState<{
    meetsChallenge: string;
    isResourceFeasible: string;
    isOrganizationalFit: string;
    needsMultipleModels: string;
  }>({
    meetsChallenge: '',
    isResourceFeasible: '',
    isOrganizationalFit: '',
    needsMultipleModels: ''
  });

  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  
  const [finalDecision, setFinalDecision] = useState<{
    reasonsForChoice: string;
    implementationRequirements: string;
  }>({
    reasonsForChoice: '',
    implementationRequirements: ''
  });

  // טעינת מידע מה-localStorage בעת טעינת הקומפוננטה
  useEffect(() => {
    const savedFinalCheck = localStorage.getItem('finalCheck');
    const savedSelectedModels = localStorage.getItem('selectedModels');
    const savedFinalDecision = localStorage.getItem('finalDecision');
    
    if (savedFinalCheck) {
      setFinalCheck(JSON.parse(savedFinalCheck));
    }
    
    if (savedSelectedModels) {
      setSelectedModels(JSON.parse(savedSelectedModels));
    }
    
    if (savedFinalDecision) {
      setFinalDecision(JSON.parse(savedFinalDecision));
    }
  }, []);

  // שמירת הנתונים ב-localStorage כאשר הם משתנים
  useEffect(() => {
    localStorage.setItem('finalCheck', JSON.stringify(finalCheck));
  }, [finalCheck]);

  useEffect(() => {
    localStorage.setItem('selectedModels', JSON.stringify(selectedModels));
  }, [selectedModels]);

  useEffect(() => {
    localStorage.setItem('finalDecision', JSON.stringify(finalDecision));
  }, [finalDecision]);

  // טיפול בשינוי בחירת המודלים
  const handleModelChange = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        return [...prev, modelId];
      }
    });
  };

  // פונקציה להשגת כותרת המודל לפי ה-ID
  const getModelTitle = (modelId: string): string => {
    for (const scenario in scenarioModels) {
      const model = scenarioModels[scenario as keyof typeof scenarioModels].find(m => m.id === modelId);
      if (model) return model.title;
    }
    return modelId; // במקרה שלא מצאנו, נחזיר את ה-ID עצמו
  };

  return (
    <div dir="rtl">
      {/* --- חלק ראשון: תוצר סופי --- */}
      <h3 className="text-xl font-bold mb-4">חלק ה': תוצר סופי</h3>
      <p className="mb-4">סכם את החלטתך:</p>
      
      <div className="mb-8">
        <Label className="block mb-2">1. בחר את מודל/י החניכה המתאימים (ניתן לבחור מספר מודלים):</Label>
        
        {/* מעבר על כל התרחישים והצגת המודלים שלהם */}
        {Object.keys(scenarioModels).map((scenario) => (
          <Card key={scenario} className="mb-4 mt-4">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-2">{scenarioTitles[scenario as keyof typeof scenarioTitles]}</h4>
              <div className="grid grid-cols-3 gap-4">
                {scenarioModels[scenario as keyof typeof scenarioModels].map((model) => (
                  <div 
                    key={model.id} 
                    className={`flex items-center p-2 rounded-md cursor-pointer ${model.color} ${selectedModels.includes(model.id) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleModelChange(model.id)}
                  >
                    <input 
                      type="checkbox" 
                      id={`model-${model.id}`} 
                      checked={selectedModels.includes(model.id)}
                      onChange={() => handleModelChange(model.id)}
                      className="h-4 w-4 ml-2"
                    />
                    <label 
                      htmlFor={`model-${model.id}`} 
                      className="cursor-pointer text-sm flex-1"
                    >
                      {model.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* תיבת טקסט למודלים אחרים */}
        <div className="mt-4">
          <Label className="block mb-2">מודלים אחרים (פרט):</Label>
          <Textarea
            value={selectedModels.find(m => typeof m === 'string' && m.startsWith('custom:')) 
              ? (selectedModels.find(m => typeof m === 'string' && m.startsWith('custom:')) || '').replace('custom:', '') 
              : ''}
            onChange={(e) => {
              const customModel = e.target.value;
              if (customModel) {
                setSelectedModels(prev => {
                  // מסיר מודלים מותאמים אישית קיימים
                  const filtered = prev.filter(m => typeof m === 'string' && !m.startsWith('custom:'));
                  // מוסיף את המודל החדש
                  return [...filtered, `custom:${customModel}`];
                });
              } else {
                setSelectedModels(prev => prev.filter(m => typeof m === 'string' && !m.startsWith('custom:')));
              }
            }}
            placeholder="פרט מודלים אחרים כאן..."
            className="w-full h-20"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <Label className="block mb-2">2. הסיבות לבחירה:</Label>
        <Textarea
          value={finalDecision.reasonsForChoice}
          onChange={(e) => setFinalDecision({...finalDecision, reasonsForChoice: e.target.value})}
          placeholder="פרט את הסיבות לבחירה..."
          className="w-full"
        />
      </div>
      
      <div className="mb-8">
        <Label className="block mb-2">3. תנאים נדרשים ליישום:</Label>
        <Textarea
          value={finalDecision.implementationRequirements}
          onChange={(e) => setFinalDecision({...finalDecision, implementationRequirements: e.target.value})}
          placeholder="פרט את התנאים הנדרשים ליישום..."
          className="w-full"
        />
      </div>

      {/* תצוגת סיכום בחירות */}
      {selectedModels.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold mb-2">המודלים שנבחרו:</h4>
          <ul className="list-disc list-inside">
            {selectedModels.map((modelId, index) => (
              <li key={index}>
                {typeof modelId === 'string' && modelId.startsWith('custom:') 
                  ? modelId.replace('custom:', '') 
                  : getModelTitle(modelId)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- חלק שני: בחינת התאמה סופית --- */}
      <h3 className="text-xl font-bold mb-4 mt-12">בחינת התאמה סופית</h3>
      <p className="mb-4">לאחר זיהוי המודל/ים המתאים/ים, שאל את עצמך:</p>
      
      <div className="mb-8">
        <Label className="block mb-2">1. האם המודל עונה על האתגר המרכזי שזוהה?</Label>
        <Textarea
          value={finalCheck.meetsChallenge}
          onChange={(e) => setFinalCheck({...finalCheck, meetsChallenge: e.target.value})}
          placeholder="כתוב את תשובתך כאן..."
          className="w-full"
        />
      </div>
      
      <div className="mb-8">
        <Label className="block mb-2">2. האם הוא ישים במסגרת המשאבים הקיימים?</Label>
        <Textarea
          value={finalCheck.isResourceFeasible}
          onChange={(e) => setFinalCheck({...finalCheck, isResourceFeasible: e.target.value})}
          placeholder="כתוב את תשובתך כאן..."
          className="w-full"
        />
      </div>
      
      <div className="mb-8">
        <Label className="block mb-2">3. האם הוא מתאים לתרבות הארגונית של ביה"ס?</Label>
        <Textarea
          value={finalCheck.isOrganizationalFit}
          onChange={(e) => setFinalCheck({...finalCheck, isOrganizationalFit: e.target.value})}
          placeholder="כתוב את תשובתך כאן..."
          className="w-full"
        />
      </div>
      
      <div className="mb-8">
        <Label className="block mb-2">4. האם יש צורך בשילוב של מספר מודלים?</Label>
        <Textarea
          value={finalCheck.needsMultipleModels}
          onChange={(e) => setFinalCheck({...finalCheck, needsMultipleModels: e.target.value})}
          placeholder="כתוב את תשובתך כאן..."
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FinalSummary;