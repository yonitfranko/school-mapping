"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types definitions
type ImplementationValue = 'excellent' | 'good' | 'average' | 'needs-improvement';
type EffectivenessValue = 'high' | 'medium' | 'low';
type StatusType = 'בוצע' | 'בתהליך' | 'בעיכוב' | 'טרם החל' | 'הושלם חלקית' | 'ממתין למשוב' | 'דורש התערבות' | '';

interface TrackItem {
  id: number;
  topic: string;
  status: StatusType;
  notes: string;
}

interface SemesterChanges {
  organizational: string;
  pedagogical: string;
  climate: string;
}

interface SemesterEvaluation {
  goals: string[];
  changes: SemesterChanges;
  insights: string;
  recommendations: string;
}

interface RubricEvaluation {
  implementation: ImplementationValue | '';
  effectiveness: EffectivenessValue | '';
}

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const TrackingForm: React.FC = () => {
  const defaultTopics = [
    'יישום תכנית העבודה',
    'התקדמות בזירות המיקוד',
    'אתגרים וחסמים',
    'הצלחות',
    'צרכים ובקשות'
  ];

  const statusOptions = [
    'בוצע',
    'בתהליך',
    'בעיכוב',
    'טרם החל',
    'הושלם חלקית',
    'ממתין למשוב',
    'דורש התערבות'
  ];

  // State for dates
  const [monthlyDate, setMonthlyDate] = useState<string>('');
  const [semesterDate, setSemesterDate] = useState<string>('');
  const [rubricDate, setRubricDate] = useState<string>('');

  const [monthlyTracks, setMonthlyTracks] = useState<TrackItem[]>(
    defaultTopics.map((topic, index) => ({
      id: index + 1,
      topic: topic,
      status: '',
      notes: ''
    }))
  );

  const [semesterEval, setSemesterEval] = useState<SemesterEvaluation>({
    goals: ['', '', ''],
    changes: {
      organizational: '',
      pedagogical: '',
      climate: ''
    },
    insights: '',
    recommendations: ''
  });

  const [rubric, setRubric] = useState<RubricEvaluation>({
    implementation: '',
    effectiveness: ''
  });

  const addMonthlyRow = () => {
    setMonthlyTracks([
      ...monthlyTracks,
      { id: monthlyTracks.length + 1, topic: '', status: '', notes: '' }
    ]);
  };

  const DateInput: React.FC<DateInputProps> = ({ value, onChange, label }) => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm">{label}:</span>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[200px] bg-white text-right"
      />
    </div>
  );

  return (
    <div className="w-full" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-right">טפסי מעקב ובקרה</h1>
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 shadow-md bg-gradient-to-b from-blue-50/50 to-blue-100/50 rounded-lg">
          <TabsTrigger value="rubric" className="text-right">מחוון הערכה</TabsTrigger>
          <TabsTrigger value="semester" className="text-right">הערכה סמסטריאלית</TabsTrigger>
          <TabsTrigger value="monthly" className="text-right">מעקב חודשי</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <div className="p-6 bg-blue-50/30 shadow-md rounded-lg">
            <DateInput 
              value={monthlyDate}
              onChange={setMonthlyDate}
              label="תאריך המעקב"
            />
            <div className="space-y-4">
              {monthlyTracks.map((track, index) => (
                <div key={track.id} className="grid grid-cols-3 gap-4">
                  <Input 
                    placeholder="הערות"
                    value={track.notes}
                    onChange={(e) => {
                      const newTracks = [...monthlyTracks];
                      newTracks[index].notes = e.target.value;
                      setMonthlyTracks(newTracks);
                    }}
                    className="bg-white text-right"
                  />
                  <Select
                    value={track.status}
                    onValueChange={(value: string) => {
                      const newTracks = [...monthlyTracks];
                      newTracks[index].status = value as StatusType;
                      setMonthlyTracks(newTracks);
                    }}
                  >
                    <SelectTrigger className="bg-white text-right">
                      <SelectValue placeholder="בחר סטטוס" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="hover:bg-gray-100 text-right">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="נושא"
                    value={track.topic}
                    onChange={(e) => {
                      const newTracks = [...monthlyTracks];
                      newTracks[index].topic = e.target.value;
                      setMonthlyTracks(newTracks);
                    }}
                    className="bg-white text-right"
                  />
                </div>
              ))}
              <Button onClick={addMonthlyRow} className="w-full bg-gray-200 hover:bg-blue-300">הוסף שורה</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="semester">
          <div className="p-6 bg-blue-50/30 shadow-md rounded-lg space-y-6">
            <DateInput 
              value={semesterDate}
              onChange={setSemesterDate}
              label="תאריך ההערכה"
            />
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-right">מידת ההתקדמות ביעדים:</h3>
              {semesterEval.goals.map((goal, index) => (
                <div key={index} className="mb-4">
                  <Input 
                    placeholder={`יעד ${index + 1}`}
                    value={goal}
                    onChange={(e) => {
                      const newGoals = [...semesterEval.goals];
                      newGoals[index] = e.target.value;
                      setSemesterEval({...semesterEval, goals: newGoals});
                    }}
                    className="bg-white text-right"
                  />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-right">שינויים מרכזיים:</h3>
              <div className="space-y-4">
                <Input 
                  placeholder="שינויים ארגוניים"
                  value={semesterEval.changes.organizational}
                  onChange={(e) => setSemesterEval({
                    ...semesterEval,
                    changes: {...semesterEval.changes, organizational: e.target.value}
                  })}
                  className="bg-white text-right"
                />
                <Input 
                  placeholder="שינויים פדגוגיים"
                  value={semesterEval.changes.pedagogical}
                  onChange={(e) => setSemesterEval({
                    ...semesterEval,
                    changes: {...semesterEval.changes, pedagogical: e.target.value}
                  })}
                  className="bg-white text-right"
                />
                <Input 
                  placeholder="שינויים אקלימיים"
                  value={semesterEval.changes.climate}
                  onChange={(e) => setSemesterEval({
                    ...semesterEval,
                    changes: {...semesterEval.changes, climate: e.target.value}
                  })}
                  className="bg-white text-right"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-right">תובנות והמלצות:</h3>
              <div className="space-y-4">
                <Textarea 
                  placeholder="תובנות"
                  value={semesterEval.insights}
                  onChange={(e) => setSemesterEval({
                    ...semesterEval,
                    insights: e.target.value
                  })}
                  className="bg-white text-right"
                />
                <Textarea 
                  placeholder="המלצות"
                  value={semesterEval.recommendations}
                  onChange={(e) => setSemesterEval({
                    ...semesterEval,
                    recommendations: e.target.value
                  })}
                  className="bg-white text-right"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rubric">
          <div className="p-6 bg-blue-50/30 shadow-md rounded-lg space-y-6">
            <DateInput 
              value={rubricDate}
              onChange={setRubricDate}
              label="תאריך ההערכה"
            />
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-right">איכות היישום:</h3>
              <Select
                value={rubric.implementation}
                onValueChange={(value: string) => setRubric({...rubric, implementation: value as ImplementationValue})}
              >
                <SelectTrigger className="bg-white text-right">
                  <SelectValue placeholder="בחר דירוג" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="excellent" className="hover:bg-gray-100 text-right">מצוין (90-100%)</SelectItem>
                  <SelectItem value="good" className="hover:bg-gray-100 text-right">טוב (75-89%)</SelectItem>
                  <SelectItem value="average" className="hover:bg-gray-100 text-right">בינוני (60-74%)</SelectItem>
                  <SelectItem value="needs-improvement" className="hover:bg-gray-100 text-right">טעון שיפור (פחות מ-60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-right">אפקטיביות:</h3>
              <Select
                value={rubric.effectiveness}
                onValueChange={(value: string) => setRubric({...rubric, effectiveness: value as EffectivenessValue})}
              >
                <SelectTrigger className="bg-white text-right">
                  <SelectValue placeholder="בחר דירוג" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="high" className="hover:bg-gray-100 text-right">גבוהה</SelectItem>
                  <SelectItem value="medium" className="hover:bg-gray-100 text-right">בינונית</SelectItem>
                  <SelectItem value="low" className="hover:bg-gray-100 text-right">נמוכה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingForm;